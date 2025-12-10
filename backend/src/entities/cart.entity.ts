import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { CartItem } from './cart-item.entity';

export enum CartStatus {
    ACTIVE = 'active',
    ABANDONED = 'abandoned',
    CONVERTED = 'converted', // Converted to order
}

@Entity('carts')
export class Cart {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ nullable: true })
    userId: string;

    // For guest users (before login)
    @Column({ nullable: true })
    sessionId: string;

    @OneToMany(() => CartItem, cartItem => cartItem.cart, { cascade: true })
    items: CartItem[];

    @Column({
        type: 'enum',
        enum: CartStatus,
        default: CartStatus.ACTIVE,
    })
    status: CartStatus;

    // Calculated fields (updated when items change)
    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    subtotal: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    tax: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    shipping: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    discount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    total: number;

    @Column({ default: 0 })
    itemCount: number;

    // Coupon/Promo code
    @Column({ nullable: true })
    couponCode: string;

    // Cart expiry for abandoned carts
    @Column({ type: 'timestamp', nullable: true })
    expiresAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
