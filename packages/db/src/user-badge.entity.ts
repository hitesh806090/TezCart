import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Badge } from './badge.entity';

@Entity('user_badges')
@Index(['userId', 'badgeId', 'tenantId'], { unique: true })
export class UserBadge extends BaseEntity {
  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'badge_id', nullable: false })
  badgeId: string;

  @ManyToOne(() => Badge, badge => badge.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'badge_id' })
  badge: Badge;

  @Column({ type: 'timestamp', nullable: false })
  awardedAt: Date;

  @Column({ type: 'text', nullable: true })
  reason: string;
}
