import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('addresses')
@Index(['userId', 'tenantId'])
export class Address extends BaseEntity {
  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: false })
  name: string; // e.g., "Home", "Work" or recipient name

  @Column({ nullable: false })
  addressLine1: string;

  @Column({ nullable: true })
  addressLine2: string;

  @Column({ nullable: false })
  city: string;

  @Column({ nullable: false })
  state: string;

  @Column({ nullable: false })
  pincode: string;

  @Column({ nullable: false, default: 'India' })
  country: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  @Column({ default: false })
  isDefault: boolean;
}
