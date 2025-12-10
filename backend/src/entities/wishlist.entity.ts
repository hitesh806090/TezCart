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
import { Product } from './product.entity';

@Entity('wishlists')
@Index(['userId', 'productId'], { unique: true }) // One entry per user-product combination
export class Wishlist {
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

    @Column({ type: 'text', nullable: true })
    note: string; // Personal note about why they want this

    @Column({ nullable: true })
    desiredPrice: number; // Price alert threshold

    @Column({ default: true })
    notifyOnPriceChange: boolean;

    @Column({ default: true })
    notifyOnBackInStock: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
