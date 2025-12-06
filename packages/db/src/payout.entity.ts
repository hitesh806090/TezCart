import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity'; // The user who is the seller

@Entity('payouts')
@Index(['sellerId', 'tenantId'])
@Index(['status', 'tenantId'])
export class Payout extends BaseEntity {
  @Column({ name: 'seller_id', nullable: false })
  sellerId: string;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number;

  @Column({ nullable: false })
  currency: string;

  @Column({ name: 'bank_account_number', nullable: false })
  bankAccountNumber: string; // Snapshot of bank account used for payout

  @Column({ name: 'bank_ifsc_code', nullable: false })
  bankIfscCode: string; // Snapshot of IFSC code

  @Column({ type: 'jsonb', nullable: true })
  orderBreakdown: object; // Details of orders included in this payout

  @Column({ type: 'jsonb', nullable: true })
  feeBreakdown: object; // Details of commissions, fees deducted

  @Column({ nullable: false, default: 'pending' })
  status: string; // e.g., 'pending', 'processed', 'failed', 'reverted'

  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date;

  @Column({ type: 'text', nullable: true })
  failureReason: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: object; // Additional payout-related info
}
