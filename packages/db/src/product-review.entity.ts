import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity'; // The user who submitted the review
import { Product } from './product.entity';
import { Order } from './order.entity'; // Link to order to verify purchase

@Entity('product_reviews')
@Index(['productId', 'tenantId'])
@Index(['userId', 'productId', 'tenantId'], { unique: true }) // One review per user per product
export class ProductReview extends BaseEntity {
  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'product_id', nullable: false })
  productId: string;

  @ManyToOne(() => Product, product => product.id)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'order_id', nullable: true })
  orderId: string; // The order through which the product was purchased

  @ManyToOne(() => Order, order => order.id, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'int', nullable: false })
  rating: number; // 1-5 stars

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'jsonb', nullable: true })
  imageUrls: string[]; // URLs of images uploaded with review

  @Column({ nullable: false, default: 'pending' })
  status: string; // 'pending', 'approved', 'rejected'

  @Column({ type: text, nullable: true })
  rejectionReason: string;

  @Column({ type: 'int', nullable: false, default: 0 })
  helpfulCount: number; // Number of users who found this review helpful
}
