import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('badges')
@Index(['tenantId', 'slug'], { unique: true })
export class Badge extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  slug: string; // URL-friendly identifier

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string; // URL to badge image

  @Column({ nullable: false, default: 'manual' })
  awardCriteria: string; // e.g., 'manual', 'order_count', 'spend_threshold', 'mission_completion'

  @Column({ type: 'jsonb', nullable: true })
  criteriaDetails: object; // JSONB for detailed criteria (e.g., { minOrders: 10 })

  @Column({ nullable: false, default: 'active' })
  status: string; // 'active', 'inactive'

  @Column({ type: 'jsonb', nullable: true })
  rewards: object; // JSONB for rewards associated with earning this badge (e.g., { points: 100, couponId: 'uuid' })
}
