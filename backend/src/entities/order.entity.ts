import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Index,
} from 'typeorm';
import { User } from './user.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded',
}

export enum PaymentStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

export enum PaymentMethod {
    CREDIT_CARD = 'credit_card',
    DEBIT_CARD = 'debit_card',
    UPI = 'upi',
    NET_BANKING = 'net_banking',
    WALLET = 'wallet',
    COD = 'cod', // Cash on Delivery
}

@Entity('orders')
@Index(['userId', 'status'])
@Index(['orderNumber'], { unique: true })
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    orderNumber: string; // Human-readable order number (e.g., ORD-2025-001234)

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
    items: OrderItem[];

    // Order Status
    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    status: OrderStatus;

    // Payment
    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    })
    paymentStatus: PaymentStatus;

    @Column({
        type: 'enum',
        enum: PaymentMethod,
    })
    paymentMethod: PaymentMethod;

    @Column({ nullable: true })
    paymentTransactionId: string;

    @Column({ type: 'timestamp', nullable: true })
    paidAt: Date;

    // Pricing
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    subtotal: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    tax: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    shippingCost: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    discount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalAmount: number;

    // Shipping Address
    @Column({ type: 'json' })
    shippingAddress: {
        fullName: string;
        phone: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };

    // Billing Address (if different)
    @Column({ type: 'json', nullable: true })
    billingAddress: {
        fullName: string;
        phone: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };

    // Coupon/Discount
    @Column({ nullable: true })
    couponCode: string;

    // Tracking
    @Column({ nullable: true })
    trackingNumber: string;

    @Column({ nullable: true })
    carrier: string; // Shipping carrier (FedEx, UPS, etc.)

    @Column({ type: 'timestamp', nullable: true })
    estimatedDeliveryDate: Date;

    @Column({ type: 'timestamp', nullable: true })
    deliveredAt: Date;

    // Notes
    @Column({ type: 'text', nullable: true })
    customerNotes: string;

    @Column({ type: 'text', nullable: true })
    adminNotes: string;

    // Cancellation
    @Column({ nullable: true })
    cancellationReason: string;

    @Column({ type: 'timestamp', nullable: true })
    cancelledAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
