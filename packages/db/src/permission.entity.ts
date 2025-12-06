import { Entity, Column, Index, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Role } from './role.entity';

@Entity('permissions')
@Index(['name', 'tenantId'], { unique: true }) // Permission name unique per tenant
export class Permission extends BaseEntity {
  @Column({ nullable: false })
  name: string; // e.g., 'product.create', 'order.view_all', 'user.manage'

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Role, role => role.permissions)
  roles: Role[];
}
