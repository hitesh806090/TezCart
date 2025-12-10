"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../entities/order.entity");
const order_item_entity_1 = require("../entities/order-item.entity");
const cart_entity_1 = require("../entities/cart.entity");
const product_entity_1 = require("../entities/product.entity");
const cart_service_1 = require("../cart/cart.service");
const products_service_1 = require("../products/products.service");
let OrdersService = class OrdersService {
    ordersRepository;
    orderItemsRepository;
    cartsRepository;
    productsRepository;
    cartService;
    productsService;
    constructor(ordersRepository, orderItemsRepository, cartsRepository, productsRepository, cartService, productsService) {
        this.ordersRepository = ordersRepository;
        this.orderItemsRepository = orderItemsRepository;
        this.cartsRepository = cartsRepository;
        this.productsRepository = productsRepository;
        this.cartService = cartService;
        this.productsService = productsService;
    }
    async generateOrderNumber() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));
        const count = await this.ordersRepository.count({
            where: {
                createdAt: (0, typeorm_2.Between)(startOfDay, endOfDay),
            },
        });
        const orderNum = String(count + 1).padStart(6, '0');
        return `ORD-${year}${month}-${orderNum}`;
    }
    async createOrder(createOrderDto, userId) {
        const cart = await this.cartService.getMyCart(userId);
        if (!cart.items || cart.items.length === 0) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        for (const cartItem of cart.items) {
            if (!cartItem.isAvailable) {
                throw new common_1.BadRequestException(`Product "${cartItem.productSnapshot.name}" is no longer available`);
            }
            const product = await this.productsRepository.findOne({
                where: { id: cartItem.productId },
            });
            if (!product) {
                throw new common_1.BadRequestException(`Product "${cartItem.productSnapshot.name}" not found`);
            }
            if (product.trackInventory && product.stockQuantity < cartItem.quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for "${product.name}". Only ${product.stockQuantity} available`);
            }
        }
        const orderNumber = await this.generateOrderNumber();
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
            status: order_entity_1.OrderStatus.PENDING,
            paymentStatus: order_entity_1.PaymentStatus.PENDING,
        });
        const savedOrder = await this.ordersRepository.save(order);
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
        for (const cartItem of cart.items) {
            await this.productsService.decrementStock(cartItem.productId, cartItem.quantity);
        }
        await this.cartService.clearCart(userId);
        return this.findOne(savedOrder.id);
    }
    async findAll(query, userId, sellerId) {
        const { page = 1, limit = 20, status, dateFrom, dateTo } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.ordersRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.items', 'items')
            .leftJoinAndSelect('items.product', 'product');
        if (userId) {
            queryBuilder.andWhere('order.userId = :userId', { userId });
        }
        if (sellerId) {
            queryBuilder.andWhere('items.sellerId = :sellerId', { sellerId });
        }
        if (status) {
            queryBuilder.andWhere('order.status = :status', { status });
        }
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
        queryBuilder.orderBy('order.createdAt', 'DESC');
        queryBuilder.skip(skip).take(limit);
        const [data, total] = await queryBuilder.getManyAndCount();
        return { data, total, page, limit };
    }
    async findOne(id) {
        const order = await this.ordersRepository.findOne({
            where: { id },
            relations: ['items', 'items.product', 'user'],
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async findByOrderNumber(orderNumber) {
        const order = await this.ordersRepository.findOne({
            where: { orderNumber },
            relations: ['items', 'items.product', 'user'],
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async updateStatus(id, updateStatusDto, userRole) {
        const order = await this.findOne(id);
        if (userRole !== 'admin' && userRole !== 'seller') {
            throw new common_1.ForbiddenException('Only admin or seller can update order status');
        }
        order.status = updateStatusDto.status;
        if (updateStatusDto.adminNotes) {
            order.adminNotes = updateStatusDto.adminNotes;
        }
        if (updateStatusDto.status === order_entity_1.OrderStatus.DELIVERED) {
            order.deliveredAt = new Date();
        }
        return this.ordersRepository.save(order);
    }
    async addTracking(id, addTrackingDto, userRole) {
        const order = await this.findOne(id);
        if (userRole !== 'admin' && userRole !== 'seller') {
            throw new common_1.ForbiddenException('Only admin or seller can add tracking information');
        }
        order.trackingNumber = addTrackingDto.trackingNumber;
        order.carrier = addTrackingDto.carrier;
        if (addTrackingDto.estimatedDeliveryDate) {
            order.estimatedDeliveryDate = new Date(addTrackingDto.estimatedDeliveryDate);
        }
        order.status = order_entity_1.OrderStatus.SHIPPED;
        return this.ordersRepository.save(order);
    }
    async cancelOrder(id, cancelOrderDto, userId, userRole) {
        const order = await this.findOne(id);
        if (order.userId !== userId && userRole !== 'admin') {
            throw new common_1.ForbiddenException('You cannot cancel this order');
        }
        if ([order_entity_1.OrderStatus.SHIPPED, order_entity_1.OrderStatus.DELIVERED].includes(order.status)) {
            throw new common_1.BadRequestException('Cannot cancel order that has been shipped or delivered');
        }
        order.status = order_entity_1.OrderStatus.CANCELLED;
        order.cancellationReason = cancelOrderDto.reason;
        order.cancelledAt = new Date();
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
    async getMyOrders(userId, query) {
        return this.findAll(query, userId);
    }
    async getSellerOrders(sellerId, query) {
        return this.findAll(query, undefined, sellerId);
    }
    async getOrderStats(userId, sellerId) {
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
            pending: orders.filter(o => o.status === order_entity_1.OrderStatus.PENDING).length,
            processing: orders.filter(o => o.status === order_entity_1.OrderStatus.PROCESSING).length,
            shipped: orders.filter(o => o.status === order_entity_1.OrderStatus.SHIPPED).length,
            delivered: orders.filter(o => o.status === order_entity_1.OrderStatus.DELIVERED).length,
            cancelled: orders.filter(o => o.status === order_entity_1.OrderStatus.CANCELLED).length,
            totalRevenue: orders
                .filter(o => o.status !== order_entity_1.OrderStatus.CANCELLED)
                .reduce((sum, o) => sum + Number(o.totalAmount), 0),
        };
        return stats;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(cart_entity_1.Cart)),
    __param(3, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        cart_service_1.CartService,
        products_service_1.ProductsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map