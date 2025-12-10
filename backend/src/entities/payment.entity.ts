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
import { Order } from './order.entity';
import { User } from './user.entity';

export enum PaymentMethod {
    CREDIT_CARD = 'credit_card',
    DEBIT_CARD = 'debit_card',
    UPI = 'upi',
    NET_BANKING = 'net_banking',
    WALLET = 'wallet',
    COD = 'cod',
}

export enum PaymentStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
    REFUNDED = 'refunded',
    PARTIALLY_REFUNDED = 'partially_refunded',
}

export enum PaymentGateway {
    STRIPE = 'stripe',
    RAZORPAY = 'razorpay',
    PAYPAL = 'paypal',
    MANUAL = 'manual',
}

@Entity('payments')
@Index(['orderId'])
@Index(['userId'])
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Order, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @Column()
    orderId: string;

    @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    @Column({
        type: 'enum',
        enum: PaymentMethod,
    })
    paymentMethod: PaymentMethod;

    @Column({
        type: 'enum',
        enum: PaymentGateway,
    })
    gateway: PaymentGateway;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    })
    status: PaymentStatus;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ default: 'USD' })
    currency: string;

    // Gateway transaction details
    @Column({ nullable: true })
    transactionId: string; // Gateway transaction ID

    @Column({ nullable: true })
    gatewayOrderId: string; // Gateway order reference

    @Column({ type: 'json', nullable: true })
    gatewayResponse: any; // Full gateway response

    // Card details (last 4 digits only)
    @Column({ nullable: true })
    cardLast4: string;

    @Column({ nullable: true })
    cardBrand: string;

    // Refund details
    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    refundedAmount: number;

    @Column({ nullable: true })
    refundReason: string;

    @Column({ type: 'timestamp', nullable: true })
    refundedAt: Date;

    // Failure details
    @Column({ nullable: true })
    failureReason: string;

    @Column({ nullable: true })
    failureCode: string;

    @Column({ type: 'timestamp', nullable: true })
    paidAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
