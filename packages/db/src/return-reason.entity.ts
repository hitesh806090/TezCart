import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('return_reasons')
@Index(['tenantId', 'name'], { unique: true })
export class ReturnReason extends BaseEntity {
  @Column({ nullable: false })
  name: string; // e.g., "Damaged Item", "Wrong Size", "Changed Mind"

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: object; // e.g., { requiresPhoto: true, appliesToCategories: ['apparel'] }
}
