import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { User } from './user.entity';

export enum NotificationType {
    ORDER_PLACED = 'order_placed',
    ORDER_CONFIRMED = 'order_confirmed',
    ORDER_SHIPPED = 'order_shipped',
    ORDER_DELIVERED = 'order_delivered',
    ORDER_CANCELLED = 'order_cancelled',
    PRICE_DROP = 'price_drop',
    BACK_IN_STOCK = 'back_in_stock',
    REVIEW_REPLY = 'review_reply',
    NEW_MESSAGE = 'new_message',
    PRODUCT_APPROVED = 'product_approved',
    PRODUCT_REJECTED = 'product_rejected',
    PAYMENT_SUCCESS = 'payment_success',
    PAYMENT_FAILED = 'payment_failed',
    COUPON_EXPIRING = 'coupon_expiring',
    LOW_STOCK_ALERT = 'low_stock_alert',
}

export enum NotificationPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent',
}

@Entity('notifications')
@Index(['userId', 'isRead'])
@Index(['userId', 'createdAt'])
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    @Column({
        type: 'enum',
        enum: NotificationType,
    })
    type: NotificationType;

    @Column()
    title: string;

    @Column({ type: 'text' })
    message: string;

    @Column({ type: 'json', nullable: true })
    data: any; // Additional data (orderId, productId, etc.)

    @Column({ nullable: true })
    actionUrl: string; // URL to navigate to when clicked

    @Column({
        type: 'enum',
        enum: NotificationPriority,
        default: NotificationPriority.MEDIUM,
    })
    priority: NotificationPriority;

    @Column({ default: false })
    isRead: boolean;

    @Column({ type: 'timestamp', nullable: true })
    readAt: Date;

    @Column({ default: false })
    isSent: boolean; // For email/SMS notifications

    @Column({ type: 'timestamp', nullable: true })
    sentAt: Date;

    @Column({ default: false })
    isPush: boolean; // Push notification sent

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
