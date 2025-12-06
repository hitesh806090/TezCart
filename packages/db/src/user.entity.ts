import { Entity, Column, Index, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Role } from './role.entity';

@Entity('users')
@Index(['email', 'tenantId'], { unique: true }) // Ensure email is unique per tenant
export class User extends BaseEntity {
  @Column({ nullable: false })
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  passwordHash: string; // Hashed password

  @Column({ default: 'customer' })
  defaultPersona: string; // 'customer', 'seller', 'delivery_partner', 'admin'

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  profile: object; // Stores additional user profile data

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];
}
