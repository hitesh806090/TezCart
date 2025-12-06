import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('automatic_discounts')
@Index(['tenantId', 'name'], { unique: true })
@Index(['tenantId', 'validFrom', 'validUntil'])
export class AutomaticDiscount extends BaseEntity {
  @Column({ nullable: false })
  name: string; // e.g., "Buy 2 Get 1 Free", "10% off on orders over $100"

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: false })
  type: string; // e.g., 'buy_x_get_y', 'percentage_off_cart', 'fixed_amount_off_cart'

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  value: number; // For percentage or fixed amount discounts

  @Column({ type: 'timestamp', nullable: false })
  validFrom: Date;

  @Column({ type: 'timestamp', nullable: false })
  validUntil: Date;

  @Column({ type: 'jsonb', nullable: true })
  conditions: object; // JSONB for detailed conditions (e.g., minCartValue, targetCategoryIds, targetProductIds)
  // Example for buy_x_get_y: { buyQuantity: 2, getQuantity: 1, targetProductId: 'uuid' }

  @Column({ type: 'jsonb', nullable: true })
  discountDetails: object; // JSONB for additional details on how discount is applied

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'int', nullable: true })
  usageLimit: number; // Max number of times this discount can be applied globally
}
