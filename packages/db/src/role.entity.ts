import { Entity, Column, Index, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Permission } from './permission.entity';
import { User } from './user.entity';

@Entity('roles')
@Index(['name', 'tenantId'], { unique: true }) // Role name unique per tenant
export class Role extends BaseEntity {
  @Column({ nullable: false })
  name: string; // e.g., 'customer', 'seller', 'admin', 'super_admin'

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Permission)
  permissions: Permission[];

  @ManyToMany(() => User, user => user.roles)
  users: User[];
}
