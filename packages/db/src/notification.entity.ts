import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('notifications')
@Index(['userId', 'tenantId'])
@Index(['status', 'tenantId'])
export class Notification extends BaseEntity {
  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: false })
  type: string; // Type of notification (e.g., 'order_status', 'promo', 'system_alert')

  @Column({ nullable: false })
  channel: string; // Channel sent through (e.g., 'email', 'sms', 'push', 'in_app')

  @Column({ type: 'text', nullable: true })
  recipient: string; // Email address, phone number, device token

  @Column({ nullable: false })
  subject: string; // Subject for emails, title for push/in-app

  @Column({ type: 'text', nullable: false })
  body: string; // Rendered message content

  @Column({ nullable: false, default: 'pending' })
  status: string; // 'pending', 'sent', 'delivered', 'failed', 'read'

  @Column({ type: 'jsonb', nullable: true })
  metadata: object; // Additional data (e.g., deep-link URL, sender ID)

  @Column({ type: 'text', nullable: true })
  failureReason: string;

  @Column({ type: 'timestamp', nullable: true })
  sentAt: Date;
}
