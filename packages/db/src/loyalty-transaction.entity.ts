import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { LoyaltyPoint } from './loyalty-point.entity';
import { Order } from './order.entity'; // Optional: link to order if earning/spending is order-related

@Entity('loyalty_transactions')
@Index(['loyaltyPointId', 'tenantId'])
@Index(['transactionType', 'tenantId'])
export class LoyaltyTransaction extends BaseEntity {
  @Column({ name: 'loyalty_point_id', nullable: false })
  loyaltyPointId: string;

  @ManyToOne(() => LoyaltyPoint, loyaltyPoint => loyaltyPoint.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'loyalty_point_id' })
  loyaltyPoint: LoyaltyPoint;

  @Column({ type: 'int', nullable: false })
  points: number; // Positive for earn, negative for redeem

  @Column({ nullable: false })
  transactionType: string; // e.g., 'earn_purchase', 'redeem_checkout', 'adjustment', 'expiry'

  @Column({ nullable: false })
  status: string; // e.g., 'pending', 'completed', 'failed'

  @Column({ name: 'reference_id', nullable: true })
  referenceId: string; // e.g., orderId, campaignId

  @Column({ name: 'order_id', nullable: true })
  orderId: string; // Link to order if applicable

  @ManyToOne(() => Order, order => order.id, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date; // For earned points with expiry
}
