import { User } from './user.entity';
export declare enum NotificationType {
    ORDER_PLACED = "order_placed",
    ORDER_CONFIRMED = "order_confirmed",
    ORDER_SHIPPED = "order_shipped",
    ORDER_DELIVERED = "order_delivered",
    ORDER_CANCELLED = "order_cancelled",
    PRICE_DROP = "price_drop",
    BACK_IN_STOCK = "back_in_stock",
    REVIEW_REPLY = "review_reply",
    NEW_MESSAGE = "new_message",
    PRODUCT_APPROVED = "product_approved",
    PRODUCT_REJECTED = "product_rejected",
    PAYMENT_SUCCESS = "payment_success",
    PAYMENT_FAILED = "payment_failed",
    COUPON_EXPIRING = "coupon_expiring",
    LOW_STOCK_ALERT = "low_stock_alert"
}
export declare enum NotificationPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}
export declare class Notification {
    id: string;
    user: User;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data: any;
    actionUrl: string;
    priority: NotificationPriority;
    isRead: boolean;
    readAt: Date;
    isSent: boolean;
    sentAt: Date;
    isPush: boolean;
    createdAt: Date;
    updatedAt: Date;
}
