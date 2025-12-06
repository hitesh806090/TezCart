import { Injectable, Logger, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { DeliveryTask } from 'db';
import { ReturnPickupTask } from 'db'; // Import ReturnPickupTask
import { TenantProvider } from '..//common/tenant.module';
import { OrderService } from '../order/order.service';
import { DeliveryPartnerService } from '../delivery-partner/delivery-partner.service';
import { AddressService } from '../address/address.service';
import { OtpService } from '../otp/otp.service';
import { Order } from 'db';
import { DeliveryPartnerProfile } from 'db';
import { ReturnService } from '../return/return.service'; // Import ReturnService

@Injectable()
export class AssignmentService {
  private readonly logger = new Logger(AssignmentService.name);

  constructor(
    @InjectRepository(DeliveryTask)
    private readonly deliveryTaskRepository: Repository<DeliveryTask>,
    @InjectRepository(ReturnPickupTask)
    private readonly returnPickupTaskRepository: Repository<ReturnPickupTask>, // Inject ReturnPickupTask Repository
    private readonly tenantProvider: TenantProvider,
    private readonly orderService: OrderService,
    private readonly deliveryPartnerService: DeliveryPartnerService,
    private readonly addressService: AddressService,
    private readonly otpService: OtpService,
    private readonly entityManager: EntityManager,
    private readonly returnService: ReturnService, // Inject ReturnService
  ) {}

  private get tenantId(): string {
    const tenantId = this.tenantProvider.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing.');
    }
    return tenantId;
  }

  // --- Outbound Delivery Task Management (Existing) ---
  async createDeliveryTask(orderId: string): Promise<DeliveryTask> {
    const order = await this.orderService.findOrderById(orderId);
    if (!order || order.tenantId !== this.tenantId) {
      throw new NotFoundException(`Order with ID ${orderId} not found or not in your tenant.`);
    }
    if (order.parentOrderId === null) {
      throw new BadRequestException('Only child orders can have delivery tasks.');
    }
    if (order.status !== 'ready_for_pickup') {
      throw new BadRequestException(`Order ${orderId} is not ready for pickup.`);
    }

    const existingTask = await this.deliveryTaskRepository.findOne({ where: { orderId, tenantId: this.tenantId } });
    if (existingTask) {
        throw new ConflictException(`Delivery task already exists for order ${orderId}.`);
    }

    const pickupLocation = order.shippingAddress;
    const deliveryLocation = order.shippingAddress;

    const deliveryTask = this.deliveryTaskRepository.create({
      orderId,
      tenantId: this.tenantId,
      status: 'pending_assignment',
      pickupLocation: pickupLocation,
      deliveryLocation: deliveryLocation,
    });
    return this.deliveryTaskRepository.save(deliveryTask);
  }

  async autoAssignTask(taskId: string): Promise<DeliveryTask> {
    const task = await this.deliveryTaskRepository.findOne({ where: { id: taskId, tenantId: this.tenantId }, relations: ['order'] });
    if (!task) {
      throw new NotFoundException(`Delivery task with ID ${taskId} not found.`);
    }
    if (task.status !== 'pending_assignment') {
      throw new BadRequestException(`Task ${taskId} is not in pending assignment status.`);
    }

    const pickupAddress = await this.addressService.findAddressById(task.order.userId, task.order.shippingAddressId);
    // TODO: Get actual seller address, not buyer's shipping address for pickup

    const eligiblePartners = await this.deliveryPartnerService.dpProfileRepository.find({
        where: { tenantId: this.tenantId, kycStatus: 'approved', status: 'online' }
    });

    if (eligiblePartners.length === 0) {
      this.logger.warn(`No eligible delivery partners found for task ${taskId}.`);
      throw new NotFoundException('No eligible delivery partners available.');
    }

    let bestPartner: DeliveryPartnerProfile | null = null;
    let minDistance = Infinity;

    for (const partner of eligiblePartners) {
      if (partner.currentLatitude && partner.currentLongitude && pickupAddress.latitude && pickupAddress.longitude) {
        const distance = this.calculateDistance(
          partner.currentLatitude, partner.currentLongitude,
          pickupAddress.latitude, pickupAddress.longitude
        );
        if (distance < minDistance) {
          minDistance = distance;
          bestPartner = partner;
        }
      } else {
          this.logger.warn(`Partner ${partner.id} or pickup address missing coordinates.`);
      }
    }

    if (bestPartner) {
      task.deliveryPartnerId = bestPartner.id;
      task.status = 'assigned';
      task.assignedAt = new Date();
      await this.deliveryTaskRepository.save(task);
      await this.orderService.updateOrderStatus(task.orderId, 'assigned_to_dp', bestPartner.userId);
      this.logger.log(`Task ${taskId} assigned to partner ${bestPartner.id}.`);
      return task;
    } else {
      throw new NotFoundException('Could not find a suitable delivery partner for assignment.');
    }
  }

  async acceptTask(taskId: string, deliveryPartnerId: string): Promise<DeliveryTask> {
    const task = await this.deliveryTaskRepository.findOne({ where: { id: taskId, tenantId: this.tenantId, deliveryPartnerId } });
    if (!task) {
      throw new NotFoundException(`Delivery task with ID ${taskId} not found or not assigned to you.`);
    }
    if (task.status !== 'assigned') {
      throw new BadRequestException(`Task ${taskId} is not in assigned status.`);
    }
    task.status = 'accepted';
    task.acceptedAt = new Date();
    await this.orderService.updateOrderStatus(task.orderId, 'dp_accepted', deliveryPartnerId);
    return this.deliveryTaskRepository.save(task);
  }

  async declineTask(taskId: string, deliveryPartnerId: string, reason: string): Promise<DeliveryTask> {
    const task = await this.deliveryTaskRepository.findOne({ where: { id: taskId, tenantId: this.tenantId, deliveryPartnerId } });
    if (!task) {
      throw new NotFoundException(`Delivery task with ID ${taskId} not found or not assigned to you.`);
    }
    if (task.status !== 'assigned') {
      throw new BadRequestException(`Task ${taskId} is not in assigned status.`);
    }
    task.status = 'declined';
    task.failureReason = reason;
    await this.orderService.updateOrderStatus(task.orderId, 'dp_declined', deliveryPartnerId);
    await this.deliveryTaskRepository.save(task);
    return this.autoAssignTask(taskId);
  }

  async generateAndSendOtp(taskId: string): Promise<{ otpSent: boolean }> {
    const task = await this.deliveryTaskRepository.findOne({ where: { id: taskId, tenantId: this.tenantId }, relations: ['order', 'order.user'] });
    if (!task) {
      throw new NotFoundException(`Delivery task with ID ${taskId} not found.`);
    }
    if (task.status !== 'picked_up' && task.status !== 'accepted') {
        throw new BadRequestException(`OTP can only be generated for task in 'accepted' or 'picked_up' status.`);
    }

    const customerContact = task.order.user.phoneNumber || task.order.user.email;
    if (!customerContact) {
        throw new BadRequestException('Customer contact information not available to send OTP.');
    }

    const otp = await this.otpService.sendOtp(customerContact, task.order.userId, `delivery_${task.orderId}`);
    task.otp = otp;
    await this.deliveryTaskRepository.save(task);
    this.logger.log(`OTP sent to customer for task ${taskId}`);
    return { otpSent: true };
  }

  async verifyOtp(taskId: string, otp: string): Promise<DeliveryTask> {
    const task = await this.deliveryTaskRepository.findOne({ where: { id: taskId, tenantId: this.tenantId }, relations: ['order', 'order.user'] });
    if (!task) {
      throw new NotFoundException(`Delivery task with ID ${taskId} not found.`);
    }
    if (task.isOtpVerified) {
        throw new BadRequestException('OTP already verified for this task.');
    }
    if (!task.otp) {
        throw new BadRequestException('No OTP was generated for this task.');
    }

    const customerContact = task.order.user.phoneNumber || task.order.user.email;
    const isOtpValid = await this.otpService.verifyOtp(customerContact, otp);

    if (!isOtpValid) {
        throw new BadRequestException('Invalid OTP.');
    }

    task.isOtpVerified = true;
    await this.deliveryTaskRepository.save(task);
    return task;
  }

  async completeDelivery(taskId: string, deliveryPartnerId: string, proofPhotoUrls?: string[], customerSignatureUrl?: string): Promise<DeliveryTask> {
    const task = await this.deliveryTaskRepository.findOne({ where: { id: taskId, tenantId: this.tenantId, deliveryPartnerId } });
    if (!task) {
      throw new NotFoundException(`Delivery task with ID ${taskId} not found or not assigned to you.`);
    }
    if (task.status !== 'picked_up' && task.status !== 'accepted' && task.status !== 'in_transit') {
        throw new BadRequestException(`Task ${taskId} is not in a valid status for delivery completion.`);
    }

    task.status = 'delivered';
    task.deliveredAt = new Date();
    task.proofPhotoUrls = proofPhotoUrls;
    task.customerSignatureUrl = customerSignatureUrl;
    
    await this.orderService.updateOrderStatus(task.orderId, 'delivered', deliveryPartnerId);
    return this.deliveryTaskRepository.save(task);
  }

  // --- Inbound Return Pickup Task Management ---
  async createReturnPickupTask(returnRequestId: string): Promise<ReturnPickupTask> {
    const returnRequest = await this.returnService.getReturnRequest(returnRequestId);
    if (!returnRequest || returnRequest.tenantId !== this.tenantId) {
      throw new NotFoundException(`Return Request with ID ${returnRequestId} not found or not in your tenant.`);
    }
    if (returnRequest.status !== 'approved') {
      throw new BadRequestException(`Return Request ${returnRequestId} is not approved for pickup.`);
    }

    const existingTask = await this.returnPickupTaskRepository.findOne({ where: { returnRequestId, tenantId: this.tenantId } });
    if (existingTask) {
        throw new ConflictException(`Return pickup task already exists for return request ${returnRequestId}.`);
    }

    // For MVP, using customer's shipping address for pickup.
    const customerAddress = await this.addressService.findAddressById(returnRequest.userId, returnRequest.order.shippingAddressId);
    if (!customerAddress) {
        throw new NotFoundException('Customer shipping address not found for return pickup.');
    }

    const returnPickupTask = this.returnPickupTaskRepository.create({
      returnRequestId,
      tenantId: this.tenantId,
      status: 'pending_assignment',
      pickupLocation: customerAddress,
    });
    return this.returnPickupTaskRepository.save(returnPickupTask);
  }

  async autoAssignReturnPickupTask(taskId: string): Promise<ReturnPickupTask> {
    const task = await this.returnPickupTaskRepository.findOne({ where: { id: taskId, tenantId: this.tenantId }, relations: ['returnRequest'] });
    if (!task) {
      throw new NotFoundException(`Return pickup task with ID ${taskId} not found.`);
    }
    if (task.status !== 'pending_assignment') {
      throw new BadRequestException(`Task ${taskId} is not in pending assignment status.`);
    }

    const pickupAddress = task.pickupLocation;

    const eligiblePartners = await this.deliveryPartnerService.dpProfileRepository.find({
        where: { tenantId: this.tenantId, kycStatus: 'approved', status: 'online' }
    });

    if (eligiblePartners.length === 0) {
      this.logger.warn(`No eligible delivery partners found for return pickup task ${taskId}.`);
      throw new NotFoundException('No eligible delivery partners available.');
    }

    let bestPartner: DeliveryPartnerProfile | null = null;
    let minDistance = Infinity;

    for (const partner of eligiblePartners) {
      if (partner.currentLatitude && partner.currentLongitude && pickupAddress.latitude && pickupAddress.longitude) {
        const distance = this.calculateDistance(
          partner.currentLatitude, partner.currentLongitude,
          pickupAddress.latitude, pickupAddress.longitude
        );
        if (distance < minDistance) {
          minDistance = distance;
          bestPartner = partner;
        }
      } else {
          this.logger.warn(`Partner ${partner.id} or pickup address missing coordinates.`);
      }
    }

    if (bestPartner) {
      task.deliveryPartnerId = bestPartner.id;
      task.status = 'assigned';
      task.assignedAt = new Date();
      await this.returnPickupTaskRepository.save(task);
      // Update return request status
      await this.returnService.updateReturnRequestStatus(task.returnRequestId, 'pickup_assigned', bestPartner.userId);
      this.logger.log(`Return pickup task ${taskId} assigned to partner ${bestPartner.id}.`);
      return task;
    } else {
      throw new NotFoundException('Could not find a suitable delivery partner for return pickup assignment.');
    }
  }

  async acceptReturnPickupTask(taskId: string, deliveryPartnerId: string): Promise<ReturnPickupTask> {
    const task = await this.returnPickupTaskRepository.findOne({ where: { id: taskId, tenantId: this.tenantId, deliveryPartnerId } });
    if (!task) {
      throw new NotFoundException(`Return pickup task with ID ${taskId} not found or not assigned to you.`);
    }
    if (task.status !== 'assigned') {
      throw new BadRequestException(`Task ${taskId} is not in assigned status.`);
    }
    task.status = 'accepted';
    task.acceptedAt = new Date();
    await this.returnService.updateReturnRequestStatus(task.returnRequestId, 'pickup_accepted', deliveryPartnerId);
    return this.returnPickupTaskRepository.save(task);
  }

  async completeReturnPickup(taskId: string, deliveryPartnerId: string, proofPhotoUrls?: string[]): Promise<ReturnPickupTask> {
    const task = await this.returnPickupTaskRepository.findOne({ where: { id: taskId, tenantId: this.tenantId, deliveryPartnerId } });
    if (!task) {
      throw new NotFoundException(`Return pickup task with ID ${taskId} not found or not assigned to you.`);
    }
    if (task.status !== 'accepted' && task.status !== 'in_transit') {
        throw new BadRequestException(`Task ${taskId} is not in a valid status for pickup completion.`);
    }

    task.status = 'picked_up';
    task.pickedUpAt = new Date();
    task.proofPhotoUrls = proofPhotoUrls; // Reuse field from DeliveryTask for simplicity
    
    await this.returnService.updateReturnRequestStatus(task.returnRequestId, 'picked_up', deliveryPartnerId);
    return this.returnPickupTaskRepository.save(task);
  }

  // Haversine formula
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}