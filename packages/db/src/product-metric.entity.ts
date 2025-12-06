import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Product } from './product.entity';

@Entity('product_metrics')
@Index(['tenantId', 'productId', 'date'])
export class ProductMetric extends BaseEntity {
  @Column({ type: 'date', nullable: false })
  date: string;

  @Column({ name: 'product_id', nullable: false })
  productId: string;

  @ManyToOne(() => Product, product => product.id)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'int', nullable: false, default: 0 })
  views: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  addToCarts: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  orders: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: false, default: 0 })
  revenue: number;
}
