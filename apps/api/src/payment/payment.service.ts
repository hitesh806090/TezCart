import { Injectable, Inject, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Payment } from 'db';
import { TenantProvider } from '..//common/tenant.module';
import { OrderService } from '../order/order.service';
import { PaymentGatewayService } from './payment.module';
import { AuditService } from '../audit/audit.service';
import { WalletService } from '../wallet/wallet.service'; // Import WalletService

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly tenantProvider: TenantProvider,
    private readonly orderService: OrderService,
    @Inject('PAYMENT_GATEWAY_SERVICE') private readonly paymentGatewayService: PaymentGatewayService,
    private readonly auditService: AuditService,
    private readonly walletService: WalletService, // Inject WalletService
    private readonly entityManager: EntityManager,
  ) {}

  private get tenantId(): string {
    const tenantId = this.tenantProvider.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing.');
    }
    return tenantId;
  }

  async createPaymentIntent(orderId: string, userId: string, amount: number, currency: string, gateway: string, paymentMethod: string): Promise<Payment> {
    if (paymentMethod === 'cod') {
        throw new BadRequestException('COD payments do not require a payment intent. Use createCodPayment instead.');
    }

    this.logger.log(`[PaymentService] Creating payment intent for Order ${orderId} via ${gateway}`);
    const order = await this.orderService.findOrderById(orderId);
    if (!order || order.userId !== userId || order.tenantId !== this.tenantId) {
      this.logger.warn(`[PaymentService] Order ${orderId} not found or unauthorized for user ${userId}.`);
      throw new NotFoundException('Order not found or unauthorized.');
    }
    if (order.status !== 'pending_payment') {
        this.logger.warn(`[PaymentService] Order ${orderId} not in pending_payment state.`);
        throw new BadRequestException('Order is not in pending_payment state.');
    }
    if (amount !== order.totalAmount) {
        this.logger.warn(`[PaymentService] Payment amount mismatch for Order ${orderId}. Expected: ${order.totalAmount}, Received: ${amount}.`);
        throw new BadRequestException('Payment amount does not match order total.');
    }

    const gatewayIntent = await this.paymentGatewayService.createPaymentIntent(
      amount,
      currency,
      orderId,
      { userId, tenantId: this.tenantId, orderCode: order.orderCode },
    );

    const payment = this.paymentRepository.create({
      orderId,
      userId,
      tenantId: this.tenantId,
      gateway,
      paymentMethod,
      amount,
      currency,
      transactionId: gatewayIntent.id,
      status: 'pending',
      gatewayResponse: gatewayIntent,
    });

    const savedPayment = await this.paymentRepository.save(payment);
    this.logger.log(`[PaymentService] Payment intent created for Order ${orderId}, Payment ID: ${savedPayment.id}`);
    
    await this.auditService.createAuditLog({
        tenantId: this.tenantId,
        userId: userId,
        action: 'PAYMENT_INTENT_CREATED',
        entityType: 'Payment',
        entityId: savedPayment.id,
        newValue: { status: 'pending', orderId, amount, gateway, paymentMethod },
        ipAddress: '',
        userAgent: '',
        endpoint: `/payments/create-intent`,
    });

    return savedPayment;
  }

  async createCodPayment(orderId: string, userId: string, amount: number, currency: string): Promise<Payment> {
    this.logger.log(`[PaymentService] Creating COD payment for Order ${orderId}`);
    const order = await this.orderService.findOrderById(orderId);
    if (!order || order.userId !== userId || order.tenantId !== this.tenantId) {
        throw new NotFoundException('Order not found or unauthorized.');
    }
    if (order.status !== 'pending_payment') {
        throw new BadRequestException('Order is not in pending_payment state for COD.');
    }
    if (amount !== order.totalAmount) {
        throw new BadRequestException('COD amount does not match order total.');
    }

    const payment = this.paymentRepository.create({
      orderId,
      userId,
      tenantId: this.tenantId,
      gateway: 'cod',
      paymentMethod: 'cod',
      amount,
      currency,
      transactionId: `cod_${order.orderCode}_${uuidv4().substring(0, 8)}`,
      status: 'succeeded',
      gatewayResponse: { message: 'Cash on Delivery selected' },
    });

    const savedPayment = await this.paymentRepository.save(payment);
    this.logger.log(`[PaymentService] COD payment created for Order ${orderId}, Payment ID: ${savedPayment.id}`);

    await this.auditService.createAuditLog({
        tenantId: this.tenantId,
        userId: userId,
        action: 'PAYMENT_COD_CREATED',
        entityType: 'Payment',
        entityId: savedPayment.id,
        newValue: { status: 'succeeded', orderId, amount, gateway: 'cod', paymentMethod: 'cod' },
        ipAddress: '',
        userAgent: '',
        endpoint: `/payments/cod`,
    });

    await this.orderService.updateOrderStatus(orderId, 'confirmed', userId);

    return savedPayment;
  }

  async processPaymentWebhook(gateway: string, payload: any, signature?: string): Promise<void> {
    this.logger.log(`[PaymentService] Received webhook for gateway ${gateway}`);
    this.logger.debug(`[PaymentService] Webhook Payload: ${JSON.stringify(payload)}`);

    const webhookEvent = await this.paymentGatewayService.handleWebhook(payload, signature);
    const transactionId = webhookEvent?.data?.id;

    if (!transactionId) {
        this.logger.error('[PaymentService] Webhook payload missing transaction ID.');
        throw new BadRequestException('Webhook payload missing transaction ID.');
    }

    const payment = await this.paymentRepository.findOne({ where: { transactionId, tenantId: this.tenantId } });

    if (!payment) {
        this.logger.warn(`[PaymentService] Payment record not found for transaction ID: ${transactionId}.`);
        throw new NotFoundException(`Payment record not found for transaction ID: ${transactionId}.`);
    }

    const oldStatus = payment.status;
    let newStatus: string;

    if (webhookEvent.type === 'payment.succeeded') {
      newStatus = 'succeeded';
      this.logger.log(`[PaymentService] Payment ${payment.id} for Order ${payment.orderId} succeeded.`);
      await this.orderService.updateOrderStatus(payment.orderId, 'confirmed', payment.userId);
    } else if (webhookEvent.type === 'payment.failed') {
      newStatus = 'failed';
      this.logger.warn(`[PaymentService] Payment ${payment.id} for Order ${payment.orderId} failed.`);
      await this.orderService.updateOrderStatus(payment.orderId, 'payment_failed', payment.userId);
    } else if (webhookEvent.type === 'payment.refunded') {
        newStatus = 'refunded';
        this.logger.log(`[PaymentService] Payment ${payment.id} for Order ${payment.orderId} refunded.`);
        // Note: The order status for refunded payment will be handled by ReturnService
    }
    else {
        this.logger.log(`[PaymentService] Unhandled webhook event type: ${webhookEvent.type}`);
        return;
    }

    payment.status = newStatus;
    payment.gatewayResponse = { ...payment.gatewayResponse, webhookEvent };
    payment.rawWebhookPayload = payload;
    await this.paymentRepository.save(payment);

    await this.auditService.createAuditLog({
        tenantId: this.tenantId,
        userId: payment.userId,
        action: `PAYMENT_STATUS_UPDATE_${newStatus.toUpperCase()}`,
        entityType: 'Payment',
        entityId: payment.id,
        oldValue: { status: oldStatus },
        newValue: { status: newStatus },
        ipAddress: '',
        userAgent: '',
        endpoint: `/payments/webhook/${gateway}`,
    });
  }

  async refundPayment(paymentId: string, amount: number, userId: string, refundMethod: 'wallet' | 'source'): Promise<Payment> {
    this.logger.log(`[PaymentService] Initiating refund for Payment ${paymentId}, Amount ${amount}, Method ${refundMethod}`);
    const payment = await this.paymentRepository.findOne({ where: { id: paymentId, tenantId: this.tenantId } });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${paymentId} not found.`);
    }
    if (payment.status !== 'succeeded') {
      throw new BadRequestException('Only succeeded payments can be refunded.');
    }
    if (amount <= 0 || amount > payment.amount) {
      throw new BadRequestException('Invalid refund amount.');
    }

    if (refundMethod === 'wallet') {
      // Credit to user's wallet
      await this.walletService.creditWallet(userId, amount, 'refund', `Refund for Order ${payment.orderId}`, payment.id, payment.orderId);
      payment.status = 'refunded';
      // No external gateway call needed for wallet refunds
    } else { // refundMethod === 'source'
      // Call payment gateway refund API
      const gatewayRefundResult = await this.paymentGatewayService.refund(payment.transactionId, amount); // Use transactionId for refunding
      if (gatewayRefundResult.status !== 'succeeded') {
        throw new BadRequestException('Payment gateway refund failed.');
      }
      payment.status = 'refunded';
      payment.gatewayResponse = { ...payment.gatewayResponse, refundResult: gatewayRefundResult };
    }

    const updatedPayment = await this.paymentRepository.save(payment);

    await this.auditService.createAuditLog({
        tenantId: this.tenantId,
        userId: userId,
        action: 'PAYMENT_REFUNDED',
        entityType: 'Payment',
        entityId: updatedPayment.id,
        newValue: { status: 'refunded', amount: amount, refundMethod },
        ipAddress: '',
        userAgent: '',
        endpoint: `/payments/${paymentId}/refund`,
    });

    return updatedPayment;
  }

  async findPaymentById(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id, tenantId: this.tenantId } });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found.`);
    }
    return payment;
  }
}
