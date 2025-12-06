import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, Not, IsNull } from 'typeorm';
import { Order } from 'db';
import { OrderItem } from 'db';
import { TenantProvider } from '..//common/tenant.module';
import { CartService } from '../cart/cart.service';
import { CheckoutService } from '../checkout/checkout.service';
import { InventoryService } from '../inventory/inventory.service';
import { User } from 'db';
import { AssignmentService } from '../assignment/assignment.service';
import { TrackingGateway } from '../tracking/tracking.gateway';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { NotificationService } from '../notification/notification.service'; // Import NotificationService
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly tenantProvider: TenantProvider,
    private readonly cartService: CartService,
    private readonly checkoutService: CheckoutService,
    private readonly inventoryService: InventoryService,
    private readonly entityManager: EntityManager,
    private readonly assignmentService: AssignmentService,
    private readonly trackingGateway: TrackingGateway,
    private readonly loyaltyService: LoyaltyService,
    private readonly notificationService: NotificationService, // Inject NotificationService
  ) {}

  private get tenantId(): string {
    const tenantId = this.tenantProvider.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing.');
    }
    return tenantId;
  }

  async createOrderFromCheckout(
    userId: string,
    cartId: string,
    addressId: string,
    shippingMethodId: string,
    totalAmount: number,
    currency: string,
  ): Promise<Order> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      const checkoutSummary = await this.checkoutService.getCheckoutSummary(userId, cartId, addressId, shippingMethodId);
      const cartDetails = checkoutSummary.cart;

      if (!checkoutSummary.shippingAddress) {
        throw new BadRequestException('Shipping address not selected or invalid.');
      }
      if (!checkoutSummary.selectedShippingMethod) {
        throw new BadRequestException('Shipping method not selected or invalid.');
      }
      if (!cartDetails.sellerGroups || cartDetails.sellerGroups.length === 0) {
        throw new BadRequestException('Cart is empty.');
      }

      const parentOrderCode = `ORD-${uuidv4().substring(0, 8).toUpperCase()}`;
      const parentOrder = transactionalEntityManager.create(Order, {
        tenantId: this.tenantId,
        orderCode: parentOrderCode,
        userId: userId,
        shippingAddressId: addressId,
        shippingMethodId: shippingMethodId,
        subTotal: cartDetails.cartTotal,
        shippingCost: checkoutSummary.shippingCost,
        totalAmount: totalAmount,
        status: 'pending_payment',
        parentOrderId: null,
        sellerId: null,
      });
      await transactionalEntityManager.save(parentOrder);

      for (const sellerGroup of cartDetails.sellerGroups) {
        const childOrderCode = `${parentOrderCode}-S${sellerGroup.seller.id.substring(0, 4)}`;
        const childOrder = transactionalEntityManager.create(Order, {
          tenantId: this.tenantId,
          orderCode: childOrderCode,
          userId: userId,
          parentOrderId: parentOrder.id,
          sellerId: sellerGroup.seller.id,
          shippingAddressId: addressId,
          shippingMethodId: shippingMethodId,
          subTotal: sellerGroup.subtotal,
          shippingCost: 0,
          totalAmount: sellerGroup.subtotal,
          status: 'pending_confirmation',
        });
        await transactionalEntityManager.save(childOrder);

        for (const cartItem of sellerGroup.items) {
          const orderItem = transactionalEntityManager.create(OrderItem, {
            tenantId: this.tenantId,
            orderId: childOrder.id,
            productId: cartItem.productId,
            productTitle: cartItem.product.title,
            sellerId: cartItem.sellerId,
            quantity: cartItem.quantity,
            price: cartItem.price,
            attributes: cartItem.attributes,
          });
          await transactionalEntityManager.save(orderItem);

          await this.inventoryService.reserveStock(cartItem.productId, cartItem.quantity);
        }
      }

      await this.cartService.clearCart(cartId);
      this.trackingGateway.emitOrderStatusUpdate(parentOrder);
      
      // Send notification for order creation
      await this.notificationService.sendNotification(
          userId,
          'order_status_update',
          'email',
          { orderCode: parentOrder.orderCode, status: parentOrder.status },
      );
      await this.notificationService.sendNotification(
          userId,
          'order_status_update',
          'in_app',
          { orderCode: parentOrder.orderCode, status: parentOrder.status },
      );


      return parentOrder;
    });
  }

  async findUserOrders(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId, tenantId: this.tenantId, parentOrderId: IsNull() },
      relations: ['user', 'shippingAddress', 'shippingMethod', 'items', 'childOrders'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOrderById(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, tenantId: this.tenantId },
      relations: ['user', 'shippingAddress', 'shippingMethod', 'items', 'childOrders'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found.`);
    }
    return order;
  }

  async findSellerOrders(sellerId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { sellerId, tenantId: this.tenantId, parentOrderId: Not(IsNull()) },
      relations: ['user', 'shippingAddress', 'shippingMethod', 'items'],
      order: { createdAt: 'DESC' },
    });
  }
  
  async updateOrderStatus(orderId: string, newStatus: string, updaterUserId: string): Promise<Order> {
    const order = await this.findOrderById(orderId);

    const updaterUser = await this.entityManager.getRepository(User).findOne({where: {id: updaterUserId}});

    const isBuyerOwner = order.userId === updaterUserId && order.parentOrderId === null;
    const isSellerOwner = order.sellerId === updaterUserId && order.parentOrderId !== null;
    const isAdmin = updaterUser && (updaterUser.defaultPersona === 'admin' || updaterUser.defaultPersona === 'super_admin');

    if (!isBuyerOwner && !isSellerOwner && !isAdmin) {
      throw new UnauthorizedException('You are not authorized to update this order.');
    }

    if (order.status === 'delivered' || order.status === 'cancelled' || order.status === 'refunded') {
      throw new BadRequestException(`Cannot update status for order already in final state '${order.status}'.`);
    }

    if (newStatus === 'cancelled') {
        if (order.status !== 'pending_payment' && order.status !== 'pending_confirmation') {
            throw new BadRequestException('Order can only be cancelled before processing starts.');
        }
    } else if (newStatus === 'confirmed') {
        if (order.status !== 'pending_payment' && order.status !== 'pending_confirmation') {
            throw new BadRequestException('Order cannot be confirmed from current status.');
        }
    } else if (newStatus === 'ready_for_pickup') {
        if (order.status !== 'confirmed' && order.status !== 'processing') {
            throw new BadRequestException('Order must be confirmed or processing to be ready for pickup.');
        }
        if (order.parentOrderId === null || !isSellerOwner) {
            throw new UnauthorizedException('Only sellers can mark their child orders as ready for pickup.');
        }
        await this.assignmentService.createDeliveryTask(order.id);
    } else if (newStatus === 'delivered') {
        if (order.parentOrderId === null) {
            const pointsToAward = await this.loyaltyService.calculatePointsEarnedForOrder(order.id);
            if (pointsToAward > 0) {
                await this.loyaltyService.awardPoints(order.userId, pointsToAward, 'earn_purchase', `Points for Order ${order.orderCode}`, order.id, order.id);
            }
        }
    }
    
    const oldStatus = order.status;
    order.status = newStatus;
    const updatedOrder = await this.orderRepository.save(order);
    this.trackingGateway.emitOrderStatusUpdate(updatedOrder);

    // Send notification for order status change
    await this.notificationService.sendNotification(
        order.userId,
        'order_status_update',
        'email', // Could be an array of channels
        { orderCode: updatedOrder.orderCode, oldStatus, newStatus: updatedOrder.status },
    );
    await this.notificationService.sendNotification(
        order.userId,
        'order_status_update',
        'in_app',
        { orderCode: updatedOrder.orderCode, oldStatus, newStatus: updatedOrder.status },
    );

    return updatedOrder;
  }

  async markOrderReadyForPickup(orderId: string, sellerId: string): Promise<Order> {
    const order = await this.findOrderById(orderId);

    if (order.sellerId !== sellerId) {
      throw new UnauthorizedException('You are not authorized to mark this order as ready for pickup.');
    }
    if (order.parentOrderId === null) {
      throw new BadRequestException('Only child orders can be marked ready for pickup by sellers.');
    }
    if (order.status === 'shipped' || order.status === 'delivered' || order.status === 'cancelled') {
        throw new BadRequestException(`Order cannot be marked ready for pickup in status '${order.status}'.`);
    }

    return this.updateOrderStatus(orderId, 'ready_for_pickup', sellerId);
  }

  async printShippingLabel(orderId: string, sellerId: string): Promise<{ labelUrl: string }> {
    const order = await this.findOrderById(orderId);

    if (order.sellerId !== sellerId) {
      throw new UnauthorizedException('You are not authorized to generate a label for this order.');
    }
    if (order.parentOrderId === null) {
      throw new BadRequestException('Only child orders require shipping labels.');
    }
    if (order.status === 'pending_confirmation' || order.status === 'pending_payment' || order.status === 'cancelled') {
        throw new BadRequestException(`Cannot print label for order in status '${order.status}'.`);
    }

    const mockLabelUrl = `https://mock-shipping.com/label/${order.orderCode}-${uuidv4().substring(0,4)}.pdf`;
    return { labelUrl: mockLabelUrl };
  }
}
