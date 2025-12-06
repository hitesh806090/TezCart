import { Entity, Column, OneToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('delivery_partner_profiles')
@Index(['userId', 'tenantId'], { unique: true })
export class DeliveryPartnerProfile extends BaseEntity {
  @Column({ name: 'user_id', nullable: false })
  userId: string; // The user who is the delivery partner

  @OneToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: false })
  name: string; // Full name of the delivery partner

  @Column({ nullable: true })
  phoneNumber: string; // Contact number of the delivery partner

  @Column({ nullable: true })
  vehicleType: string; // e.g., 'bike', 'scooter', 'car'

  @Column({ nullable: true })
  vehicleNumber: string; // License plate number

  @Column({ nullable: false, default: 'offline' })
  status: string; // 'online', 'offline', 'on_delivery', 'break'

  @Column({ nullable: false, default: 'pending' })
  kycStatus: string; // 'pending', 'approved', 'rejected'

  @Column({ type: 'jsonb', nullable: true })
  serviceZones: object; // List of regions/pincodes where partner operates

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  currentLatitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  currentLongitude: number;

  @Column({ type: 'timestamp', nullable: true })
  lastLocationUpdateTime: Date;

  @Column({ default: 0 })
  reliabilityScore: number; // For future use (on-time delivery, etc.)
}
