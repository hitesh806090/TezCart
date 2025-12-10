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
import { Product } from './product.entity';

@Entity('reviews')
@Index(['productId', 'userId'], { unique: true }) // One review per user per product
@Index(['productId', 'rating'])
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    @ManyToOne(() => Product, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column()
    productId: string;

    @Column({ type: 'int', width: 1 })
    rating: number; // 1-5 stars

    @Column({ type: 'text', nullable: true })
    title: string;

    @Column({ type: 'text' })
    comment: string;

    @Column({ type: 'simple-array', nullable: true })
    images: string[]; // User-uploaded review images

    @Column({ default: false })
    isVerifiedPurchase: boolean; // Did user actually buy this product?

    // Helpfulness voting
    @Column({ default: 0 })
    helpfulCount: number;

    @Column({ default: 0 })
    notHelpfulCount: number;

    // Moderation
    @Column({ default: true })
    isApproved: boolean;

    @Column({ default: false })
    isFeatured: boolean; // Featured reviews

    // Seller response
    @Column({ type: 'text', nullable: true })
    sellerResponse: string;

    @Column({ type: 'timestamp', nullable: true })
    sellerResponseDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
