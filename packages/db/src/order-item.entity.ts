import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity('order_items')
@Index(['orderId', 'productId', 'tenantId'])
export class OrderItem extends BaseEntity {
  @Column({ name: 'order_id', nullable: false })
  orderId: string;

  @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'product_id', nullable: false })
  productId: string;

  @ManyToOne(() => Product, product => product.id)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ nullable: false })
  productTitle: string; // Snapshot of product title

  @Column({ nullable: false })
  sellerId: string; // Seller ID snapshot

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number; // Price at the time of order

  @Column({ type: 'jsonb', nullable: true })
  attributes: object; // Snapshot of attributes/variant selection
}
