import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ReturnRequest } from './return-request.entity';
import { OrderItem } from './order-item.entity';
import { Product } from './product.entity'; // For product snapshot

@Entity('return_items')
@Index(['returnRequestId', 'orderItemId', 'tenantId'], { unique: true })
export class ReturnItem extends BaseEntity {
  @Column({ name: 'return_request_id', nullable: false })
  returnRequestId: string;

  @ManyToOne(() => ReturnRequest, request => request.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'return_request_id' })
  returnRequest: ReturnRequest;

  @Column({ name: 'order_item_id', nullable: false })
  orderItemId: string;

  @ManyToOne(() => OrderItem, orderItem => orderItem.id)
  @JoinColumn({ name: 'order_item_id' })
  orderItem: OrderItem;

  @Column({ name: 'product_id', nullable: false })
  productId: string; // Snapshot of product ID

  @ManyToOne(() => Product, product => product.id)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'seller_id', nullable: false })
  sellerId: string; // Snapshot of seller ID

  @Column({ type: 'int', nullable: false })
  quantity: number; // Quantity of this item being returned

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number; // Price of the item at time of order

  @Column({ type: 'jsonb', nullable: true })
  attributes: object; // Snapshot of variant attributes

  @Column({ nullable: false, default: 'pending' })
  status: string; // e.g., 'pending', 'approved', 'rejected', 'received_at_warehouse', 'refunded'

  @Column({ type: 'text', nullable: true })
  sellerComment: string; // Seller's comment on this specific return item
}
