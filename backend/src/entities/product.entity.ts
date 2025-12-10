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
import { Category } from './category.entity';

export enum ProductStatus {
    DRAFT = 'draft',
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    OUT_OF_STOCK = 'out_of_stock',
}

@Entity('products')
@Index(['sellerId', 'status'])
@Index(['categoryId', 'status'])
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    slug: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'text', nullable: true })
    shortDescription: string;

    // Pricing
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    compareAtPrice: number; // Original price for showing discounts

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    costPrice: number; // For seller's reference (not shown to customers)

    // Inventory
    @Column({ default: 0 })
    stockQuantity: number;

    @Column({ nullable: true })
    sku: string; // Stock Keeping Unit

    @Column({ default: false })
    trackInventory: boolean;

    @Column({ nullable: true })
    lowStockThreshold: number;

    // Product details
    @Column({ type: 'simple-array', nullable: true })
    images: string[]; // Array of image URLs

    @Column({ nullable: true })
    brand: string;

    @Column({ nullable: true })
    weight: number; // in grams

    @Column({ type: 'json', nullable: true })
    dimensions: {
        length: number;
        width: number;
        height: number;
        unit: string; // cm, inch, etc.
    };

    @Column({ type: 'json', nullable: true })
    attributes: Record<string, any>; // Flexible attributes like color, size, material, etc.

    // SEO
    @Column({ nullable: true })
    metaTitle: string;

    @Column({ type: 'text', nullable: true })
    metaDescription: string;

    @Column({ type: 'simple-array', nullable: true })
    tags: string[];

    // Status
    @Column({
        type: 'enum',
        enum: ProductStatus,
        default: ProductStatus.DRAFT,
    })
    status: ProductStatus;

    // Relations
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sellerId' })
    seller: User;

    @Column()
    sellerId: string;

    @ManyToOne(() => Category, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @Column({ nullable: true })
    categoryId: string;

    // Ratings & Reviews (will be implemented later)
    @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
    averageRating: number;

    @Column({ default: 0 })
    totalReviews: number;

    @Column({ default: 0 })
    totalSales: number;

    // Analytics
    @Column({ default: 0 })
    viewCount: number;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: false })
    isFeatured: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
