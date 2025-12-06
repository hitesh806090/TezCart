import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('daily_sales_metrics')
@Index(['tenantId', 'date'])
export class DailySalesMetric extends BaseEntity {
  @Column({ type: 'date', nullable: false })
  date: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: false, default: 0 })
  totalGmv: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  totalOrders: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  totalVisitors: number; // Derived from unique sessions in analytics_events

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, default: 0 })
  conversionRate: number; // Orders / Visitors * 100

  @Column({ type: 'jsonb', nullable: true })
  categoryBreakdown: object; // { categoryId: revenue }

  @Column({ type: 'jsonb', nullable: true })
  paymentMethodBreakdown: object; // { method: count }
}
