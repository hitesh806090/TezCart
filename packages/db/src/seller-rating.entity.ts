import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity'; // The user who submitted the rating
import { SellerProfile } from './seller-profile.entity';
import { Order } from './order.entity'; // Link to order to verify experience

@Entity('seller_ratings')
@Index(['sellerId', 'tenantId'])
@Index(['userId', 'sellerId', 'orderId', 'tenantId'], { unique: true }) // One rating per user per seller per order
export class SellerRating extends BaseEntity {
  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'seller_id', nullable: false })
  sellerId: string;

  @ManyToOne(() => SellerProfile, seller => seller.id)
  @JoinColumn({ name: 'seller_id' })
  seller: SellerProfile; // Or directly to User representing seller

  @Column({ name: 'order_id', nullable: true })
  orderId: string; // The order associated with this rating

  @ManyToOne(() => Order, order => order.id, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'int', nullable: false })
  rating: number; // 1-5 stars

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ nullable: false, default: 'pending' })
  status: string; // 'pending', 'approved', 'rejected'

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;
}
