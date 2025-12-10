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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("../entities/notification.entity");
let NotificationsService = class NotificationsService {
    notificationsRepository;
    constructor(notificationsRepository) {
        this.notificationsRepository = notificationsRepository;
    }
    async create(userId, type, title, message, data, actionUrl, priority = notification_entity_1.NotificationPriority.MEDIUM) {
        const notification = this.notificationsRepository.create({
            userId,
            type,
            title,
            message,
            data,
            actionUrl,
            priority,
        });
        return this.notificationsRepository.save(notification);
    }
    async findAll(userId, query) {
        const { page = 1, limit = 20, type, unreadOnly } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.notificationsRepository
            .createQueryBuilder('notification')
            .where('notification.userId = :userId', { userId });
        if (type) {
            queryBuilder.andWhere('notification.type = :type', { type });
        }
        if (unreadOnly) {
            queryBuilder.andWhere('notification.isRead = :isRead', { isRead: false });
        }
        queryBuilder.orderBy('notification.createdAt', 'DESC');
        queryBuilder.skip(skip).take(limit);
        const [data, total] = await queryBuilder.getManyAndCount();
        const unreadCount = await this.notificationsRepository.count({
            where: { userId, isRead: false },
        });
        return { data, total, unreadCount };
    }
    async markAsRead(id, userId) {
        const notification = await this.notificationsRepository.findOne({
            where: { id, userId },
        });
        if (!notification) {
            return null;
        }
        notification.isRead = true;
        notification.readAt = new Date();
        return this.notificationsRepository.save(notification);
    }
    async markAllAsRead(userId) {
        await this.notificationsRepository.update({ userId, isRead: false }, { isRead: true, readAt: new Date() });
    }
    async delete(id, userId) {
        await this.notificationsRepository.delete({ id, userId });
    }
    async deleteAll(userId) {
        await this.notificationsRepository.delete({ userId });
    }
    async getUnreadCount(userId) {
        return this.notificationsRepository.count({
            where: { userId, isRead: false },
        });
    }
    async notifyOrderPlaced(userId, orderId, orderNumber) {
        await this.create(userId, notification_entity_1.NotificationType.ORDER_PLACED, 'Order Placed Successfully', `Your order #${orderNumber} has been placed successfully.`, { orderId }, `/orders/${orderId}`, notification_entity_1.NotificationPriority.HIGH);
    }
    async notifyOrderShipped(userId, orderId, orderNumber, trackingNumber) {
        const message = trackingNumber
            ? `Your order #${orderNumber} has been shipped. Tracking: ${trackingNumber}`
            : `Your order #${orderNumber} has been shipped.`;
        await this.create(userId, notification_entity_1.NotificationType.ORDER_SHIPPED, 'Order Shipped', message, { orderId, trackingNumber }, `/orders/${orderId}`, notification_entity_1.NotificationPriority.HIGH);
    }
    async notifyOrderDelivered(userId, orderId, orderNumber) {
        await this.create(userId, notification_entity_1.NotificationType.ORDER_DELIVERED, 'Order Delivered', `Your order #${orderNumber} has been delivered. Enjoy your purchase!`, { orderId }, `/orders/${orderId}`, notification_entity_1.NotificationPriority.HIGH);
    }
    async notifyPriceDrop(userId, productId, productName, newPrice) {
        await this.create(userId, notification_entity_1.NotificationType.PRICE_DROP, 'Price Drop Alert', `${productName} is now available at $${newPrice}!`, { productId, newPrice }, `/products/${productId}`, notification_entity_1.NotificationPriority.MEDIUM);
    }
    async notifyBackInStock(userId, productId, productName) {
        await this.create(userId, notification_entity_1.NotificationType.BACK_IN_STOCK, 'Back in Stock', `${productName} is now back in stock!`, { productId }, `/products/${productId}`, notification_entity_1.NotificationPriority.MEDIUM);
    }
    async notifyLowStock(userId, productId, productName, stockQuantity) {
        await this.create(userId, notification_entity_1.NotificationType.LOW_STOCK_ALERT, 'Low Stock Alert', `${productName} is running low on stock. Only ${stockQuantity} left!`, { productId, stockQuantity }, `/seller/products/${productId}`, notification_entity_1.NotificationPriority.HIGH);
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map