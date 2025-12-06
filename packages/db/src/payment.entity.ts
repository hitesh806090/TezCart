import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Order } from './order.entity';
import { User } from './user.entity';

@Entity('payments')
@Index(['orderId', 'tenantId'])
@Index(['transactionId', 'tenantId'], { unique: true })
export class Payment extends BaseEntity {
  @Column({ name: 'order_id', nullable: false })
  orderId: string;

  @ManyToOne(() => Order, order => order.id)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'user_id', nullable: false })
  userId: string; // The user who made the payment

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: false })
  gateway: string; // e.g., 'razorpay', 'stripe', 'cod'

  @Column({ nullable: true })
  paymentMethod: string; // e.g., 'card', 'upi', 'netbanking'

  @Column({ name: 'transaction_id', nullable: true })
  transactionId: string; // Gateway's transaction ID

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number;

  @Column({ nullable: false })
  currency: string;

  @Column({ nullable: false, default: 'pending' })
  status: string; // e.g., 'pending', 'succeeded', 'failed', 'refunded'

  @Column({ type: 'jsonb', nullable: true })
  gatewayResponse: object; // Raw response from the payment gateway

  @Column({ type: 'jsonb', nullable: true })
  rawWebhookPayload: object; // Raw payload from payment gateway webhooks

  @Column({ type: 'jsonb', nullable: true })
  metadata: object; // Additional metadata
}