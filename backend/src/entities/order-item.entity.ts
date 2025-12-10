import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @Column()
    orderId: string;

    @ManyToOne(() => Product, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column({ nullable: true })
    productId: string;

    @Column()
    sellerId: string; // To track which seller this item belongs to

    @Column({ type: 'int' })
    quantity: number;

    // Price at the time of order (frozen, won't change even if product price changes)
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    discount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    subtotal: number; // (price - discount) * quantity

    // Product snapshot (in case product is deleted/modified)
    @Column({ type: 'json' })
    productSnapshot: {
        name: string;
        image: string;
        sku: string;
        description: string;
        attributes?: Record<string, any>;
    };

    // Individual item status (for partial shipments)
    @Column({ nullable: true })
    status: string;

    @Column({ nullable: true })
    trackingNumber: string;

    @Column({ type: 'timestamp', nullable: true })
    shippedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deliveredAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}
