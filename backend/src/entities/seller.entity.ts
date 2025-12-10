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

export enum SellerStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    SUSPENDED = 'suspended',
    REJECTED = 'rejected',
}

export enum SellerTier {
    BRONZE = 'bronze',
    SILVER = 'silver',
    GOLD = 'gold',
    PLATINUM = 'platinum',
}

@Entity('sellers')
@Index(['userId'], { unique: true })
export class Seller {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    @Column({ unique: true })
    shopName: string;

    @Column({ unique: true })
    shopSlug: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ nullable: true })
    logo: string;

    @Column({ nullable: true })
    banner: string;

    // Business Information
    @Column()
    businessName: string;

    @Column()
    businessAddress: string;

    @Column()
    businessPhone: string;

    @Column()
    businessEmail: string;

    @Column({ nullable: true })
    taxId: string;

    @Column({ nullable: true })
    gstNumber: string;

    // Bank Details
    @Column({ type: 'json', nullable: true })
    bankDetails: {
        accountHolder: string;
        accountNumber: string;
        bankName: string;
        ifscCode: string;
        branch: string;
    };

    // Seller Metrics
    @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
    rating: number;

    @Column({ type: 'int', default: 0 })
    totalReviews: number;

    @Column({ type: 'int', default: 0 })
    totalProducts: number;

    @Column({ type: 'int', default: 0 })
    totalSales: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    totalRevenue: number;

    @Column({
        type: 'enum',
        enum: SellerTier,
        default: SellerTier.BRONZE,
    })
    tier: SellerTier;

    // Status
    @Column({
        type: 'enum',
        enum: SellerStatus,
        default: SellerStatus.PENDING,
    })
    status: SellerStatus;

    @Column({ default: true })
    isActive: boolean;

    // Commission
    @Column({ type: 'decimal', precision: 5, scale: 2, default: 10 })
    commissionRate: number; // Platform commission percentage

    // Approval
    @Column({ type: 'text', nullable: true })
    rejectionReason: string;

    @Column({ type: 'timestamp', nullable: true })
    approvedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
