import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('coupons')
@Index(['code', 'tenantId'], { unique: true })
@Index(['sellerId', 'tenantId'])
export class Coupon extends BaseEntity {
  @Column({ unique: true, nullable: false })
  code: string; // The coupon code (e.g., "SAVE10")

  @Column({ nullable: false })
  type: string; // e.g., 'percentage', 'fixed_amount', 'free_shipping'

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  value: number; // e.g., 10 (for 10%), 50 (for $50 off)

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxDiscountAmount: number; // Maximum discount amount for percentage coupons

  @Column({ type: 'timestamp', nullable: false })
  validFrom: Date;

  @Column({ type: 'timestamp', nullable: false })
  validUntil: Date;

  @Column({ nullable: true })
  sellerId: string; // Null for platform-wide coupons, ID of seller for seller-specific coupons

  @Column({ type: 'int', nullable: true })
  usageLimit: number; // Max number of times this coupon can be used globally

  @Column({ type: 'int', nullable: true })
  usageLimitPerUser: number; // Max number of times this coupon can be used per user

  @Column({ type: 'jsonb', nullable: true })
  rules: object; // JSONB for complex rules (e.g., min purchase amount, applicable categories/products)

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: object; // Additional metadata
}
