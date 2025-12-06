import { Entity, Column, Index, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('referrals')
@Index(['referrerId', 'tenantId'])
@Index(['referredUserId', 'tenantId'], { unique: true }) // One referral entry per referred user
export class Referral extends BaseEntity {
  @Column({ name: 'referrer_id', nullable: false })
  referrerId: string; // The user who referred

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'referrer_id' })
  referrer: User;

  @Column({ name: 'referred_user_id', nullable: true })
  referredUserId: string; // The user who was referred

  @OneToOne(() => User, user => user.id)
  @JoinColumn({ name: 'referred_user_id' })
  referredUser: User;

  @Column({ nullable: false })
  referralCode: string; // The code used for referral

  @Column({ nullable: false, default: 'pending' })
  status: string; // e.g., 'pending', 'qualified', 'rewarded', 'cancelled'

  @Column({ type: 'jsonb', nullable: true })
  rewards: object; // JSONB for rewards given to referrer/referred user

  @Column({ type: 'timestamp', nullable: true })
  rewardedAt: Date;
}
