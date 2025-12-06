import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('analytics_events')
@Index(['eventType', 'tenantId'])
@Index(['userId', 'tenantId'])
@Index(['sessionId', 'tenantId'])
export class AnalyticsEvent extends BaseEntity {
  @Column({ nullable: false })
  eventType: string; // e.g., 'product_view', 'add_to_cart', 'purchase', 'search', 'page_view'

  @Column({ name: 'user_id', nullable: true })
  userId: string; // Null for guest users

  @ManyToOne(() => User, user => user.id, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'session_id', nullable: true })
  sessionId: string; // User session ID (guest or authenticated)

  @Column({ nullable: true })
  productId: string; // For product-related events

  @Column({ nullable: true })
  orderId: string; // For purchase events

  @Column({ type: 'jsonb', nullable: true })
  eventData: object; // Raw data specific to the event (e.g., quantity, price, search query, filters)

  @Column({ type: 'text', nullable: true })
  pageUrl: string;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ type: 'timestamp', nullable: false })
  eventTimestamp: Date; // When the event occurred (client-side or server-side if no client timestamp)
}
