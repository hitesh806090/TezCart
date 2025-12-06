import { Entity, Column, OneToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { LoyaltyTransaction } from './loyalty-transaction.entity';

@Entity('loyalty_points')
@Index(['userId', 'tenantId'], { unique: true })
export class LoyaltyPoint extends BaseEntity {
  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @OneToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', nullable: false, default: 0 })
  balance: number; // Current points balance

  @Column({ type: 'int', nullable: false, default: 0 })
  lifetimePoints: number; // Total points ever earned

  @OneToMany(() => LoyaltyTransaction, transaction => transaction.loyaltyPoint)
  transactions: LoyaltyTransaction[];
}
