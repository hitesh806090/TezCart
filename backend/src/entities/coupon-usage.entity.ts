import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { User } from './user.entity';
import { Coupon } from './coupon.entity';
import { Order } from './order.entity';

@Entity('coupon_usage')
@Index(['userId', 'couponId'])
export class CouponUsage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    @ManyToOne(() => Coupon, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'couponId' })
    coupon: Coupon;

    @Column()
    couponId: string;

    @ManyToOne(() => Order, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @Column({ nullable: true })
    orderId: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    discountAmount: number;

    @CreateDateColumn()
    usedAt: Date;
}
