import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity('product_alerts')
@Index(['userId', 'productId', 'alertType', 'tenantId'], { unique: true })
export class ProductAlert extends BaseEntity {
  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'product_id', nullable: false })
  productId: string;

  @ManyToOne(() => Product, product => product.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ nullable: false })
  alertType: string; // e.g., 'price_drop', 'back_in_stock'

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  thresholdPrice: number; // For price drop alerts: notify if price goes below this

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  lastNotifiedPrice: number; // To prevent duplicate notifications

  @Column({ type: 'int', nullable: true })
  lastNotifiedStock: number; // To prevent duplicate notifications

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastNotifiedAt: Date;
}
