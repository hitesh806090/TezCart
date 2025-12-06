import { Entity, Column, OneToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { WalletTransaction } from './wallet-transaction.entity';

@Entity('wallets')
@Index(['userId', 'tenantId'], { unique: true })
export class Wallet extends BaseEntity {
  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @OneToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, default: 0 })
  balance: number;

  @Column({ nullable: false, default: 'INR' })
  currency: string; // Wallet currency

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => WalletTransaction, transaction => transaction.wallet)
  transactions: WalletTransaction[];
}
