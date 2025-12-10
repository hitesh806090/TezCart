import { Repository } from 'typeorm';
import { Notification, NotificationType, NotificationPriority } from '../entities/notification.entity';
import { NotificationQueryDto } from './dto/notification.dto';
export declare class NotificationsService {
    private notificationsRepository;
    constructor(notificationsRepository: Repository<Notification>);
    create(userId: string, type: NotificationType, title: string, message: string, data?: any, actionUrl?: string, priority?: NotificationPriority): Promise<Notification>;
    findAll(userId: string, query: NotificationQueryDto): Promise<{
        data: Notification[];
        total: number;
        unreadCount: number;
    }>;
    markAsRead(id: string, userId: string): Promise<Notification | null>;
    markAllAsRead(userId: string): Promise<void>;
    delete(id: string, userId: string): Promise<void>;
    deleteAll(userId: string): Promise<void>;
    getUnreadCount(userId: string): Promise<number>;
    notifyOrderPlaced(userId: string, orderId: string, orderNumber: string): Promise<void>;
    notifyOrderShipped(userId: string, orderId: string, orderNumber: string, trackingNumber?: string): Promise<void>;
    notifyOrderDelivered(userId: string, orderId: string, orderNumber: string): Promise<void>;
    notifyPriceDrop(userId: string, productId: string, productName: string, newPrice: number): Promise<void>;
    notifyBackInStock(userId: string, productId: string, productName: string): Promise<void>;
    notifyLowStock(userId: string, productId: string, productName: string, stockQuantity: number): Promise<void>;
}
