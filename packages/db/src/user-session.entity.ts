import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('user_sessions')
@Index(['jti', 'tenantId'], { unique: true }) // JWT ID must be unique per tenant
@Index(['userId', 'tenantId'])
export class UserSession extends BaseEntity {
  @Column({ nullable: false })
  jti: string; // JWT ID, unique identifier for the access token

  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'refresh_token_hash', nullable: true })
  refreshTokenHash: string; // Hashed refresh token

  @Column({ name: 'expires_at', type: 'timestamp', nullable: false })
  expiresAt: Date; // Expiration of the access token associated with this session

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', nullable: true, length: 500 })
  userAgent: string;

  @Column({ name: 'device_fingerprint', nullable: true })
  deviceFingerprint: string; // Unique identifier for the device

  @Column({ name: 'last_activity_at', type: 'timestamp', nullable: false })
  lastActivityAt: Date;

  @Column({ default: true })
  isValid: boolean; // Flag to manually invalidate a session (e.g., remote logout)
}
