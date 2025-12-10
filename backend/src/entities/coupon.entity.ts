import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

export enum DiscountType {
    PERCENTAGE = 'percentage',
    FIXED_AMOUNT = 'fixed_amount',
    FREE_SHIPPING = 'free_shipping',
}

export enum CouponStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    EXPIRED = 'expired',
}

@Entity('coupons')
@Index(['code'], { unique: true })
export class Coupon {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    code: string; // Coupon code (e.g., SAVE20, FLASH50)

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({
        type: 'enum',
        enum: DiscountType,
    })
    discountType: DiscountType;

    // Discount value (percentage or fixed amount)
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    discountValue: number;

    // Minimum order amount required
    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    minOrderAmount: number;

    // Maximum discount amount (for percentage discounts)
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    maxDiscountAmount: number;

    // Usage limits
    @Column({ type: 'int', nullable: true })
    maxTotalUses: number; // Total times this coupon can be used

    @Column({ type: 'int', default: 1 })
    maxUsesPerUser: number; // Times a single user can use this

    @Column({ type: 'int', default: 0 })
    currentUses: number; // Current usage count

    // Validity period
    @Column({ type: 'timestamp' })
    validFrom: Date;

    @Column({ type: 'timestamp' })
    validUntil: Date;

    // Restrictions
    @Column({ type: 'simple-array', nullable: true })
    applicableCategories: string[]; // Category IDs

    @Column({ type: 'simple-array', nullable: true })
    applicableProducts: string[]; // Product IDs

    @Column({ type: 'simple-array', nullable: true })
    excludedProducts: string[]; // Excluded product IDs

    @Column({ default: false })
    isFirstOrderOnly: boolean;

    @Column({
        type: 'enum',
        enum: CouponStatus,
        default: CouponStatus.ACTIVE,
    })
    status: CouponStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
