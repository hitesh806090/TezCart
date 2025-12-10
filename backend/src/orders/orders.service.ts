import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Order, OrderStatus, PaymentStatus } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Cart } from '../entities/cart.entity';
import { Product } from '../entities/product.entity';
import { CreateOrderDto, UpdateOrderStatusDto, AddTrackingDto, CancelOrderDto, OrderQueryDto } from './dto/order.dto';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private orderItemsRepository: Repository<OrderItem>,
        @InjectRepository(Cart)
        private cartsRepository: Repository<Cart>,
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        private cartService: CartService,
        private productsService: ProductsService,
    ) { }

    // Generate unique order number
    private async generateOrderNumber(): Promise<string> {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');

        // Get count of orders today
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        const count = await this.ordersRepository.count({
            where: {
                createdAt: Between(startOfDay, endOfDay),
            },
        });

        const orderNum = String(count + 1).padStart(6, '0');
        return `ORD-${year}${month}-${orderNum}`;
    }

    async createOrder(
        createOrderDto: CreateOrderDto,
        userId: string,
    ): Promise<Order> {
        // Get user's cart
        const cart = await this.cartService.getMyCart(userId);

        if (!cart.items || cart.items.length === 0) {
            throw new BadRequestException('Cart is empty');
        }

        // Validate all items are available and in stock
        for (const cartItem of cart.items) {
            if (!cartItem.isAvailable) {
                throw new BadRequestException(
                    `Product "${cartItem.productSnapshot.name}" is no longer available`,
                );
            }

            const product = await this.productsRepository.findOne({
                where: { id: cartItem.productId },
            });

            if (!product) {
                throw new BadRequestException(
                    `Product "${cartItem.productSnapshot.name}" not found`,
                );
            }

            if (product.trackInventory && product.stockQuantity < cartItem.quantity) {
                throw new BadRequestException(
                    `Insufficient stock for "${product.name}". Only ${product.stockQuantity} available`,
                );
            }
        }

        // Generate order number
        const orderNumber = await this.generateOrderNumber();

        // Create order
        const order = this.ordersRepository.create({
            orderNumber,
            userId,
            shippingAddress: createOrderDto.shippingAddress,
            billingAddress: createOrderDto.billingAddress || createOrderDto.shippingAddress,
            paymentMethod: createOrderDto.paymentMethod,
            customerNotes: createOrderDto.customerNotes,
            couponCode: createOrderDto.couponCode || cart.couponCode,
            subtotal: cart.subtotal,
            tax: cart.tax,
            shippingCost: cart.shipping,
            discount: cart.discount,
            totalAmount: cart.total,
            status: OrderStatus.PENDING,
            paymentStatus: PaymentStatus.PENDING,
        });

        const savedOrder = await this.ordersRepository.save(order);

        // Create order items from cart items
        const orderItems = cart.items.map(cartItem => {
            return this.orderItemsRepository.create({
                orderId: savedOrder.id,
                productId: cartItem.productId,
                sellerId: cartItem.productSnapshot.seller,
                quantity: cartItem.quantity,
                price: cartItem.price,
                discount: cartItem.discount,
                subtotal: cartItem.subtotal,
                productSnapshot: cartItem.productSnapshot,
            });
        });

        await this.orderItemsRepository.save(orderItems);

        // Decrement stock for each product
        for (const cartItem of cart.items) {
            await this.productsService.decrementStock(cartItem.productId, cartItem.quantity);
        }

        // Clear the cart
        await this.cartService.clearCart(userId);

        // Return complete order with items
        return this.findOne(savedOrder.id);
    }

    async findAll(
        query: OrderQueryDto,
        userId?: string,
        sellerId?: string,
    ): Promise<{ data: Order[]; total: number; page: number; limit: number }> {
        const { page = 1, limit = 20, status, dateFrom, dateTo } = query;
        const skip = (page - 1) * limit;

        const queryBuilder = this.ordersRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.items', 'items')
            .leftJoinAndSelect('items.product', 'product');

        // Filter by user
        if (userId) {
            queryBuilder.andWhere('order.userId = :userId', { userId });
        }

        // Filter by seller (for seller dashboard)
        if (sellerId) {
            queryBuilder.andWhere('items.sellerId = :sellerId', { sellerId });
        }

        // Filter by status
        if (status) {
            queryBuilder.andWhere('order.status = :status', { status });
        }

        // Filter by date range
        if (dateFrom) {
            queryBuilder.andWhere('order.createdAt >= :dateFrom', {
                dateFrom: new Date(dateFrom),
            });
        }
        if (dateTo) {
            queryBuilder.andWhere('order.createdAt <= :dateTo', {
                dateTo: new Date(dateTo),
            });
        }

        // Sort by most recent
        queryBuilder.orderBy('order.createdAt', 'DESC');

        // Pagination
        queryBuilder.skip(skip).take(limit);

        const [data, total] = await queryBuilder.getManyAndCount();

        return { data, total, page, limit };
    }

    async findOne(id: string): Promise<Order> {
        const order = await this.ordersRepository.findOne({
            where: { id },
            relations: ['items', 'items.product', 'user'],
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return order;
    }

    async findByOrderNumber(orderNumber: string): Promise<Order> {
        const order = await this.ordersRepository.findOne({
            where: { orderNumber },
            relations: ['items', 'items.product', 'user'],
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return order;
    }

    async updateStatus(
        id: string,
        updateStatusDto: UpdateOrderStatusDto,
        userRole: string,
    ): Promise<Order> {
        const order = await this.findOne(id);

        // Only admin can update status
        if (userRole !== 'admin' && userRole !== 'seller') {
            throw new ForbiddenException('Only admin or seller can update order status');
        }

        order.status = updateStatusDto.status;

        if (updateStatusDto.adminNotes) {
            order.adminNotes = updateStatusDto.adminNotes;
        }

        // Auto-update delivery timestamp
        if (updateStatusDto.status === OrderStatus.DELIVERED) {
            order.deliveredAt = new Date();
        }

        return this.ordersRepository.save(order);
    }

    async addTracking(
        id: string,
        addTrackingDto: AddTrackingDto,
        userRole: string,
    ): Promise<Order> {
        const order = await this.findOne(id);

        // Only admin/seller can add tracking
        if (userRole !== 'admin' && userRole !== 'seller') {
            throw new ForbiddenException('Only admin or seller can add tracking information');
        }

        order.trackingNumber = addTrackingDto.trackingNumber;
        order.carrier = addTrackingDto.carrier;

        if (addTrackingDto.estimatedDeliveryDate) {
            order.estimatedDeliveryDate = new Date(addTrackingDto.estimatedDeliveryDate);
        }

        // Update status to shipped
        order.status = OrderStatus.SHIPPED;

        return this.ordersRepository.save(order);
    }

    async cancelOrder(
        id: string,
        cancelOrderDto: CancelOrderDto,
        userId: string,
        userRole: string,
    ): Promise<Order> {
        const order = await this.findOne(id);

        // Check if user owns this order or is admin
        if (order.userId !== userId && userRole !== 'admin') {
            throw new ForbiddenException('You cannot cancel this order');
        }

        // Cannot cancel if already shipped or delivered
        if ([OrderStatus.SHIPPED, OrderStatus.DELIVERED].includes(order.status)) {
            throw new BadRequestException('Cannot cancel order that has been shipped or delivered');
        }

        order.status = OrderStatus.CANCELLED;
        order.cancellationReason = cancelOrderDto.reason;
        order.cancelledAt = new Date();

        // Restore stock
        for (const item of order.items) {
            if (item.productId) {
                const product = await this.productsRepository.findOne({
                    where: { id: item.productId },
                });

                if (product && product.trackInventory) {
                    product.stockQuantity += item.quantity;
                    await this.productsRepository.save(product);
                }
            }
        }

        return this.ordersRepository.save(order);
    }

    async getMyOrders(
        userId: string,
        query: OrderQueryDto,
    ): Promise<{ data: Order[]; total: number; page: number; limit: number }> {
        return this.findAll(query, userId);
    }

    async getSellerOrders(
        sellerId: string,
        query: OrderQueryDto,
    ): Promise<{ data: Order[]; total: number; page: number; limit: number }> {
        return this.findAll(query, undefined, sellerId);
    }

    async getOrderStats(userId?: string, sellerId?: string): Promise<any> {
        const queryBuilder = this.ordersRepository.createQueryBuilder('order');

        if (userId) {
            queryBuilder.where('order.userId = :userId', { userId });
        }

        if (sellerId) {
            queryBuilder
                .leftJoin('order.items', 'items')
                .where('items.sellerId = :sellerId', { sellerId });
        }

        const orders = await queryBuilder.getMany();

        const stats = {
            totalOrders: orders.length,
            pending: orders.filter(o => o.status === OrderStatus.PENDING).length,
            processing: orders.filter(o => o.status === OrderStatus.PROCESSING).length,
            shipped: orders.filter(o => o.status === OrderStatus.SHIPPED).length,
            delivered: orders.filter(o => o.status === OrderStatus.DELIVERED).length,
            cancelled: orders.filter(o => o.status === OrderStatus.CANCELLED).length,
            totalRevenue: orders
                .filter(o => o.status !== OrderStatus.CANCELLED)
                .reduce((sum, o) => sum + Number(o.totalAmount), 0),
        };

        return stats;
    }
}
