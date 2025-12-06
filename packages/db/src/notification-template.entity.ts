import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('notification_templates')
@Index(['tenantId', 'type', 'channel'], { unique: true })
export class NotificationTemplate extends BaseEntity {
  @Column({ nullable: false })
  type: string; // e.g., 'order_status_update', 'password_reset', 'promo_campaign'

  @Column({ nullable: false })
  channel: string; // e.g., 'email', 'sms', 'push', 'in_app'

  @Column({ type: 'text', nullable: true })
  subject: string; // For email

  @Column({ type: 'text', nullable: false })
  template: string; // The template content (HTML for email, plain text for SMS/Push)

  @Column({ type: 'jsonb', nullable: true })
  metadata: object; // e.g., { senderName: 'TezCart', smsLength: 160 }

  @Column({ default: true })
  isActive: boolean;
}
