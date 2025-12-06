import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Wallet } from './wallet.entity';
import { Order } from './order.entity'; // Optional: link to order if transaction is order-related

@Entity('wallet_transactions')
@Index(['walletId', 'tenantId'])
@Index(['transactionType', 'tenantId'])
export class WalletTransaction extends BaseEntity {
  @Column({ name: 'wallet_id', nullable: false })
  walletId: string;

  @ManyToOne(() => Wallet, wallet => wallet.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number;

  @Column({ nullable: false })
  transactionType: string; // e.g., 'credit', 'debit', 'refund', 'bonus'

  @Column({ nullable: false })
  status: string; // e.g., 'pending', 'completed', 'failed'

  @Column({ name: 'reference_id', nullable: true })
  referenceId: string; // e.g., orderId, refundId, paymentId

  @Column({ name: 'order_id', nullable: true })
  orderId: string; // Link to order if applicable

  @ManyToOne(() => Order, order => order.id, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: object; // Additional transaction details
}
