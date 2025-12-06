import { Injectable, NotFoundException, BadRequestException, ConflictException, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReturnRequest } from 'db';
import { ReturnItem } from 'db';
import { ReturnReason } from 'db';
import { TenantProvider } from '..//common/tenant.module';
import { OrderService } from '../order/order.service';
import { ProductService } from '../product/product.service';
import { FileUploadService } from '../file-upload/file-upload.service';
import { AssignmentService } from '../assignment/assignment.service';
import { PaymentService } from '../payment/payment.service'; // Import PaymentService
import { WalletService } from '../wallet/wallet.service'; // Import WalletService
import { OrderItem } from 'db';
import { User } from 'db';

@Injectable()
export class ReturnService {
  private readonly logger = new Logger(ReturnService.name);

  constructor(
    @InjectRepository(ReturnRequest)
    private readonly returnRequestRepository: Repository<ReturnRequest>,
    @InjectRepository(ReturnItem)
    private readonly returnItemRepository: Repository<ReturnItem>,
    @InjectRepository(ReturnReason)
    private readonly returnReasonRepository: Repository<ReturnReason>,
    private readonly tenantProvider: TenantProvider,
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
    private readonly fileUploadService: FileUploadService,
    private readonly assignmentService: AssignmentService,
    private readonly paymentService: PaymentService, // Inject PaymentService
    private readonly walletService: WalletService, // Inject WalletService
  ) {}

  private get tenantId(): string {
    const tenantId = this.tenantProvider.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing.');
    }
    return tenantId;
  }

  async createReturnReason(name: string, description?: string, isActive: boolean = true, metadata?: object): Promise<ReturnReason> {
    const existingReason = await this.returnReasonRepository.findOne({ where: { name, tenantId: this.tenantId } });
    if (existingReason) {
      throw new ConflictException(`Return reason '${name}' already exists.`);
    }
    const reason = this.returnReasonRepository.create({
      name, description, isActive, metadata, tenantId: this.tenantId
    });
    return this.returnReasonRepository.save(reason);
  }

  async findAllReturnReasons(): Promise<ReturnReason[]> {
    return this.returnReasonRepository.find({ where: { tenantId: this.tenantId, isActive: true } });
  }

  async initiateReturnRequest(
    userId: string,
    orderId: string,
    requestType: 'refund' | 'replacement',
    returnItems: Array<{ orderItemId: string; quantity: number }>,
    returnReasonId: string,
    customerComment?: string,
    proofImageUrls?: string[],
  ): Promise<ReturnRequest> {
    const order = await this.orderService.findOrderById(orderId);
    if (!order || order.userId !== userId) {
      throw new NotFoundException('Order not found or not owned by user.');
    }
    if (order.status !== 'delivered') {
      throw new BadRequestException('Returns can only be initiated for delivered orders.');
    }

    const returnReason = await this.returnReasonRepository.findOne({ where: { id: returnReasonId, tenantId: this.tenantId, isActive: true } });
    if (!returnReason) {
      throw new BadRequestException('Invalid return reason provided.');
    }

    const newReturnRequest = this.returnRequestRepository.create({
      userId,
      orderId,
      returnReasonId,
      customerComment,
      proofImageUrls,
      requestType,
      tenantId: this.tenantId,
      status: 'pending',
    });
    const savedRequest = await this.returnRequestRepository.save(newReturnRequest);

    for (const item of returnItems) {
      const orderItem = order.items.find(oi => oi.id === item.orderItemId);
      if (!orderItem) {
        throw new NotFoundException(`Order item with ID ${item.orderItemId} not found in order.`);
      }
      if (item.quantity <= 0 || item.quantity > orderItem.quantity) {
        throw new BadRequestException(`Invalid return quantity for order item ${item.orderItemId}.`);
      }

      const returnItem = this.returnItemRepository.create({
        returnRequestId: savedRequest.id,
        orderItemId: orderItem.id,
        productId: orderItem.productId,
        sellerId: orderItem.sellerId,
        quantity: item.quantity,
        price: orderItem.price,
        attributes: orderItem.attributes,
        tenantId: this.tenantId,
        status: 'pending',
      });
      await this.returnItemRepository.save(returnItem);
    }

    return savedRequest;
  }

  async getReturnRequest(returnRequestId: string): Promise<ReturnRequest> {
    const request = await this.returnRequestRepository.findOne({
      where: { id: returnRequestId, tenantId: this.tenantId },
      relations: ['items', 'items.orderItem', 'items.product', 'order'],
    });
    if (!request) {
      throw new NotFoundException('Return request not found.');
    }
    return request;
  }

  async getUserReturnRequests(userId: string): Promise<ReturnRequest[]> {
    return this.returnRequestRepository.find({
      where: { userId, tenantId: this.tenantId },
      relations: ['items', 'order'],
      order: { createdAt: 'DESC' },
    });
  }

  async getSellerReturnRequests(sellerId: string): Promise<ReturnRequest[]> {
    return this.returnRequestRepository.find({
      where: { tenantId: this.tenantId },
      relations: ['items', 'items.orderItem', 'order'],
      order: { createdAt: 'DESC' },
    }).then(requests =>
        requests.filter(req => req.items.some(item => item.sellerId === sellerId))
    );
  }

  async getAdminReturnRequests(status?: string): Promise<ReturnRequest[]> {
    const whereCondition: any = { tenantId: this.tenantId };
    if (status) {
        whereCondition.status = status;
    }
    return this.returnRequestRepository.find({
      where: whereCondition,
      relations: ['items', 'items.orderItem', 'order', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async approveReturnRequest(returnRequestId: string, updaterUserId: string, comment?: string): Promise<ReturnRequest> {
    const request = await this.getReturnRequest(returnRequestId);

    const isSeller = request.items.some(item => item.sellerId === updaterUserId);
    const updaterUser = await this.orderService.entityManager.getRepository(User).findOne({where: {id: updaterUserId}});
    const isAdmin = updaterUser && (updaterUser.defaultPersona === 'admin' || updaterUser.defaultPersona === 'super_admin');

    if (!isSeller && !isAdmin) {
      throw new UnauthorizedException('You are not authorized to approve this return request.');
    }

    if (request.status !== 'pending') {
      throw new BadRequestException(`Return request is not in 'pending' status.`);
    }

    request.status = 'approved';
    request.resolutionComment = comment;
    request.resolutionDate = new Date();
    const updatedRequest = await this.returnRequestRepository.save(request);

    for (const item of request.items) {
        item.status = 'approved';
        await this.returnItemRepository.save(item);
    }

    await this.assignmentService.createReturnPickupTask(updatedRequest.id);

    return updatedRequest;
  }

  async rejectReturnRequest(returnRequestId: string, updaterUserId: string, reason: string): Promise<ReturnRequest> {
    const request = await this.getReturnRequest(returnRequestId);

    const isSeller = request.items.some(item => item.sellerId === updaterUserId);
    const updaterUser = await this.orderService.entityManager.getRepository(User).findOne({where: {id: updaterUserId}});
    const isAdmin = updaterUser && (updaterUser.defaultPersona === 'admin' || updaterUser.defaultPersona === 'super_admin');

    if (!isSeller && !isAdmin) {
      throw new UnauthorizedException('You are not authorized to reject this return request.');
    }

    if (request.status !== 'pending') {
      throw new BadRequestException(`Return request is not in 'pending' status.`);
    }

    request.status = 'rejected';
    request.resolutionComment = reason;
    request.resolutionDate = new Date();
    const updatedRequest = await this.returnRequestRepository.save(request);

    for (const item of request.items) {
        item.status = 'rejected';
        await this.returnItemRepository.save(item);
    }
    return updatedRequest;
  }

  async processRefund(returnRequestId: string, refundMethod: 'wallet' | 'source', updaterUserId: string): Promise<ReturnRequest> {
    const request = await this.getReturnRequest(returnRequestId);

    const updaterUser = await this.orderService.entityManager.getRepository(User).findOne({where: {id: updaterUserId}});
    const isAdmin = updaterUser && (updaterUser.defaultPersona === 'admin' || updaterUser.defaultPersona === 'super_admin');

    if (!isAdmin) { // Only admins can trigger refund processing
      throw new UnauthorizedException('You are not authorized to process refunds.');
    }

    if (request.status !== 'approved' && request.status !== 'picked_up' && request.status !== 'received_at_warehouse') {
      throw new BadRequestException(`Return request is not in a valid status for refund processing.`);
    }
    if (request.status === 'refunded') {
        throw new ConflictException('Refund already processed for this request.');
    }

    // Calculate total refund amount
    let refundAmount = 0;
    for (const item of request.items) {
        refundAmount += item.price * item.quantity;
    }
    // TODO: Apply tax adjustments, shipping cost, COD fees, etc.

    // Find the original payment for the order
    const originalPayment = await this.paymentService.paymentRepository.findOne({
      where: { orderId: request.orderId, userId: request.userId, tenantId: this.tenantId, status: 'succeeded' },
      order: { createdAt: 'DESC' },
    });

    if (!originalPayment && refundMethod === 'source') {
        throw new BadRequestException('Original payment not found for source refund.');
    }

    try {
        if (refundMethod === 'wallet') {
            await this.walletService.creditWallet(request.userId, refundAmount, 'refund', `Refund for return ${request.id}`, request.id, request.orderId);
            this.logger.log(`Refunded ${refundAmount} to user ${request.userId} wallet for return ${request.id}`);
        } else if (refundMethod === 'source' && originalPayment) {
            await this.paymentService.refundPayment(originalPayment.id, refundAmount, request.userId, 'source');
            this.logger.log(`Refunded ${refundAmount} to original source for payment ${originalPayment.id} for return ${request.id}`);
        } else {
            throw new BadRequestException('Invalid refund method or no original payment found for source refund.');
        }

        request.status = 'refunded';
        request.resolutionDate = new Date();
        return this.returnRequestRepository.save(request);

    } catch (error) {
        this.logger.error(`Failed to process refund for return ${request.id}: ${error.message}`);
        throw new BadRequestException(`Refund processing failed: ${error.message}`);
    }
  }
}
