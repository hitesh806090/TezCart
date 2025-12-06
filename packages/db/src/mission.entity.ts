import { Entity, Column, Index, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserMission } from './user-mission.entity';

@Entity('missions')
@Index(['tenantId', 'slug'], { unique: true })
export class Mission extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  slug: string; // URL-friendly identifier

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: false })
  type: string; // e.g., 'once', 'daily', 'weekly', 'lifetime'

  @Column({ type: 'timestamp', nullable: false })
  validFrom: Date;

  @Column({ type: 'timestamp', nullable: false })
  validUntil: Date;

  @Column({ nullable: false, default: 'active' })
  status: string; // 'active', 'inactive'

  @Column({ type: 'jsonb', nullable: true })
  conditions: object; // JSONB for mission completion conditions (e.g., { minOrders: 3, minSpend: 100 })

  @Column({ type: 'jsonb', nullable: true })
  rewards: object; // JSONB for rewards upon mission completion (e.g., { points: 200, badgeId: 'uuid' })

  @OneToMany(() => UserMission, um => um.mission)
  userMissions: UserMission[];
}
