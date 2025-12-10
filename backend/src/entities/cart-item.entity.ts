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
import { Cart } from './cart.entity';
import { Product } from './product.entity';

@Entity('cart_items')
@Index(['cartId', 'productId'], { unique: true }) // One product per cart
export class CartItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Cart, cart => cart.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'cartId' })
    cart: Cart;

    @Column()
    cartId: string;

    @ManyToOne(() => Product, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column()
    productId: string;

    @Column({ type: 'int', default: 1 })
    quantity: number;

    // Price at the time of adding to cart (price may change later)
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    // Discount if any (promotional price, flash sale, etc.)
    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    discount: number;

    // Calculated: (price - discount) * quantity
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    subtotal: number;

    // Product details snapshot (in case product is deleted/modified)
    @Column({ type: 'json', nullable: true })
    productSnapshot: {
        name: string;
        image: string;
        sku: string;
        seller: string;
    };

    // Availability flag
    @Column({ default: true })
    isAvailable: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
