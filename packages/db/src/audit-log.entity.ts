import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('audit_logs')
@Index(['tenantId', 'createdAt'])
@Index(['entityType', 'entityId', 'tenantId'])
@Index(['userId', 'tenantId'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', nullable: false })
  tenantId: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string; // User who performed the action

  @Column({ name: 'user_email', nullable: true })
  userEmail: string; // For easier readability

  @Column({ nullable: false })
  action: string; // e.g., 'CREATE', 'UPDATE', 'DELETE'

  @Column({ name: 'entity_type', nullable: false })
  entityType: string; // e.g., 'Product', 'Order', 'User'

  @Column({ name: 'entity_id', nullable: true })
  entityId: string; // ID of the entity that was affected

  @Column({ type: 'jsonb', nullable: true })
  oldValue: object; // Snapshot of the entity before the change

  @Column({ type: 'jsonb', nullable: true })
  newValue: object; // Snapshot of the entity after the change

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ nullable: true })
  endpoint: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ nullable: true })
  correlationId: string; // To link related events
}
