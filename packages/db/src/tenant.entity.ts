import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  code: string; // e.g., 'india', 'us', 'fashion-brand'

  @Column({ nullable: true })
  domain: string; // Primary domain for the tenant

  @Column({ default: 'active' })
  status: string; // 'active', 'suspended', 'deactivated'

  @Column({ type: 'jsonb', nullable: true })
  config: object; // JSONB for flexible tenant configurations (branding, currency, etc.)

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
