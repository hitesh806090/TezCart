import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Mission } from './mission.entity';

@Entity('user_missions')
@Index(['userId', 'missionId', 'tenantId'], { unique: true })
export class UserMission extends BaseEntity {
  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'mission_id', nullable: false })
  missionId: string;

  @ManyToOne(() => Mission, mission => mission.userMissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mission_id' })
  mission: Mission;

  @Column({ type: 'jsonb', nullable: true })
  progress: object; // JSONB to track progress (e.g., { currentOrders: 1, currentSpend: 50 })

  @Column({ nullable: false, default: 'in_progress' })
  status: string; // 'in_progress', 'completed', 'failed', 'abandoned'

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;
}
