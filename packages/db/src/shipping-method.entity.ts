import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('shipping_methods')
export class ShippingMethod extends BaseEntity {
  @Column({ nullable: false })
  name: string; // e.g., "Standard Delivery", "Express Delivery"

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, default: 0 })
  baseCost: number;

  @Column({ type: 'jsonb', nullable: true })
  rules: object; // JSONB for additional rules (e.g., min order value, weight-based pricing)

  @Column({ default: true })
  isActive: boolean;
}
