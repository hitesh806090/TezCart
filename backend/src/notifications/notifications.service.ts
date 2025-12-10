import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType, NotificationPriority } from '../entities/notification.entity';
import { NotificationQueryDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private notificationsRepository: Repository<Notification>,
    ) { }

    async create(
        userId: string,
        type: NotificationType,
        title: string,
        message: string,
        data?: any,
        actionUrl?: string,
        priority: NotificationPriority = NotificationPriority.MEDIUM,
    ): Promise<Notification> {
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

    async findAll(
        userId: string,
        query: NotificationQueryDto,
    ): Promise<{ data: Notification[]; total: number; unreadCount: number }> {
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

        // Get unread count
        const unreadCount = await this.notificationsRepository.count({
            where: { userId, isRead: false },
        });

        return { data, total, unreadCount };
    }

    async markAsRead(id: string, userId: string): Promise<Notification | null> {
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

    async markAllAsRead(userId: string): Promise<void> {
        await this.notificationsRepository.update(
            { userId, isRead: false },
            { isRead: true, readAt: new Date() },
        );
    }

    async delete(id: string, userId: string): Promise<void> {
        await this.notificationsRepository.delete({ id, userId });
    }

    async deleteAll(userId: string): Promise<void> {
        await this.notificationsRepository.delete({ userId });
    }

    async getUnreadCount(userId: string): Promise<number> {
        return this.notificationsRepository.count({
            where: { userId, isRead: false },
        });
    }

    // Helper methods for creating specific notification types
    async notifyOrderPlaced(userId: string, orderId: string, orderNumber: string): Promise<void> {
        await this.create(
            userId,
            NotificationType.ORDER_PLACED,
            'Order Placed Successfully',
            `Your order #${orderNumber} has been placed successfully.`,
            { orderId },
            `/orders/${orderId}`,
            NotificationPriority.HIGH,
        );
    }

    async notifyOrderShipped(userId: string, orderId: string, orderNumber: string, trackingNumber?: string): Promise<void> {
        const message = trackingNumber
            ? `Your order #${orderNumber} has been shipped. Tracking: ${trackingNumber}`
            : `Your order #${orderNumber} has been shipped.`;

        await this.create(
            userId,
            NotificationType.ORDER_SHIPPED,
            'Order Shipped',
            message,
            { orderId, trackingNumber },
            `/orders/${orderId}`,
            NotificationPriority.HIGH,
        );
    }

    async notifyOrderDelivered(userId: string, orderId: string, orderNumber: string): Promise<void> {
        await this.create(
            userId,
            NotificationType.ORDER_DELIVERED,
            'Order Delivered',
            `Your order #${orderNumber} has been delivered. Enjoy your purchase!`,
            { orderId },
            `/orders/${orderId}`,
            NotificationPriority.HIGH,
        );
    }

    async notifyPriceDrop(userId: string, productId: string, productName: string, newPrice: number): Promise<void> {
        await this.create(
            userId,
            NotificationType.PRICE_DROP,
            'Price Drop Alert',
            `${productName} is now available at $${newPrice}!`,
            { productId, newPrice },
            `/products/${productId}`,
            NotificationPriority.MEDIUM,
        );
    }

    async notifyBackInStock(userId: string, productId: string, productName: string): Promise<void> {
        await this.create(
            userId,
            NotificationType.BACK_IN_STOCK,
            'Back in Stock',
            `${productName} is now back in stock!`,
            { productId },
            `/products/${productId}`,
            NotificationPriority.MEDIUM,
        );
    }

    async notifyLowStock(userId: string, productId: string, productName: string, stockQuantity: number): Promise<void> {
        await this.create(
            userId,
            NotificationType.LOW_STOCK_ALERT,
            'Low Stock Alert',
            `${productName} is running low on stock. Only ${stockQuantity} left!`,
            { productId, stockQuantity },
            `/seller/products/${productId}`,
            NotificationPriority.HIGH,
        );
    }
}
