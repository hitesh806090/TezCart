import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentGateway, PaymentMethod } from '../entities/payment.entity';
import { Order, OrderStatus } from '../entities/order.entity';
import { CreatePaymentDto, ProcessPaymentDto, RefundPaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Payment)
        private paymentsRepository: Repository<Payment>,
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
    ) { }

    async createPayment(createPaymentDto: CreatePaymentDto, userId: string): Promise<Payment> {
        const order = await this.ordersRepository.findOne({
            where: { id: createPaymentDto.orderId },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.userId !== userId) {
            throw new BadRequestException('This order does not belong to you');
        }

        if (order.paymentStatus === 'completed') {
            throw new BadRequestException('Order is already paid');
        }

        // Determine gateway based on payment method
        const gateway = this.getGatewayForMethod(createPaymentDto.paymentMethod);

        const payment = this.paymentsRepository.create({
            orderId: order.id,
            userId,
            paymentMethod: createPaymentDto.paymentMethod,
            gateway,
            amount: order.totalAmount,
            currency: 'USD',
            status: PaymentStatus.PENDING,
        });

        const savedPayment = await this.paymentsRepository.save(payment);

        // For COD, mark as processing
        if (createPaymentDto.paymentMethod === PaymentMethod.COD) {
            savedPayment.status = PaymentStatus.PROCESSING;
            await this.paymentsRepository.save(savedPayment);
        }

        // TODO: Integrate with actual payment gateway
        // For now, return payment object with instructions

        return savedPayment;
    }

    async processPayment(processPaymentDto: ProcessPaymentDto, userId: string): Promise<Payment> {
        const payment = await this.paymentsRepository.findOne({
            where: { id: processPaymentDto.paymentId },
            relations: ['order'],
        });

        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        if (payment.userId !== userId) {
            throw new BadRequestException('This payment does not belong to you');
        }

        if (payment.status === PaymentStatus.COMPLETED) {
            throw new BadRequestException('Payment already completed');
        }

        // TODO: Verify with actual payment gateway
        // For now, simulate successful payment

        payment.status = PaymentStatus.COMPLETED;
        payment.transactionId = processPaymentDto.transactionId || `TXN-${Date.now()}`;
        payment.paidAt = new Date();
        payment.gatewayResponse = processPaymentDto.gatewayData;

        await this.paymentsRepository.save(payment);

        // Update order payment status
        await this.ordersRepository.update(
            { id: payment.orderId },
            {
                paymentStatus: 'completed' as any,
                paymentTransactionId: payment.transactionId,
                paidAt: payment.paidAt,
            },
        );

        return payment;
    }

    async refundPayment(paymentId: string, refundDto: RefundPaymentDto): Promise<Payment> {
        const payment = await this.paymentsRepository.findOne({
            where: { id: paymentId },
            relations: ['order'],
        });

        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        if (payment.status !== PaymentStatus.COMPLETED) {
            throw new BadRequestException('Only completed payments can be refunded');
        }

        if (refundDto.amount > Number(payment.amount)) {
            throw new BadRequestException('Refund amount exceeds payment amount');
        }

        // TODO: Process refund with payment gateway

        const totalRefunded = Number(payment.refundedAmount) + refundDto.amount;
        const isFullRefund = totalRefunded >= Number(payment.amount);

        payment.refundedAmount = totalRefunded;
        payment.refundReason = refundDto.reason;
        payment.refundedAt = new Date();
        payment.status = isFullRefund ? PaymentStatus.REFUNDED : PaymentStatus.PARTIALLY_REFUNDED;

        await this.paymentsRepository.save(payment);

        // Update order status if fully refunded
        if (isFullRefund) {
            await this.ordersRepository.update(
                { id: payment.orderId },
                {
                    status: OrderStatus.REFUNDED,
                    paymentStatus: 'refunded' as any,
                },
            );
        }

        return payment;
    }

    async getPaymentsByOrder(orderId: string): Promise<Payment[]> {
        return this.paymentsRepository.find({
            where: { orderId },
            order: { createdAt: 'DESC' },
        });
    }

    async getPaymentById(id: string, userId: string): Promise<Payment> {
        const payment = await this.paymentsRepository.findOne({
            where: { id },
            relations: ['order'],
        });

        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        if (payment.userId !== userId) {
            throw new BadRequestException('This payment does not belong to you');
        }

        return payment;
    }

    async getUserPayments(userId: string): Promise<Payment[]> {
        return this.paymentsRepository.find({
            where: { userId },
            relations: ['order'],
            order: { createdAt: 'DESC' },
        });
    }

    private getGatewayForMethod(method: PaymentMethod): PaymentGateway {
        switch (method) {
            case PaymentMethod.CREDIT_CARD:
            case PaymentMethod.DEBIT_CARD:
                return PaymentGateway.STRIPE;
            case PaymentMethod.UPI:
            case PaymentMethod.NET_BANKING:
            case PaymentMethod.WALLET:
                return PaymentGateway.RAZORPAY;
            case PaymentMethod.COD:
                return PaymentGateway.MANUAL;
            default:
                return PaymentGateway.STRIPE;
        }
    }

    // Webhook handler (for payment gateway callbacks)
    async handleWebhook(gateway: PaymentGateway, payload: any): Promise<void> {
        // TODO: Implement webhook verification and processing
        // This will be called by payment gateways to notify of payment status changes
        console.log(`Received webhook from ${gateway}:`, payload);
    }
}
