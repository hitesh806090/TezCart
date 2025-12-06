import { Entity, Column, ManyToOne, JoinColumn, Index, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Category } from './category.entity';
import { User } from './user.entity'; // User will represent the seller

@Entity('products')
@Index(['slug', 'tenantId'], { unique: true }) // Slug must be unique per tenant
@Index(['categoryId', 'tenantId'])
@Index(['sellerId', 'tenantId'])
export class Product extends BaseEntity {
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  slug: string; // URL-friendly identifier

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salePrice: number;

  @Column({ nullable: true })
  imageUrl: string; // Primary image URL

  @Column({ type: 'jsonb', nullable: true })
  images: string[]; // Additional image URLs

  @Column({ nullable: false, default: 0 })
  stock: number; // Current stock level

  @Column({ nullable: false, default: 'draft' })
  status: string; // e.g., 'draft', 'pending_approval', 'published', 'archived'

  @Column({ name: 'category_id', nullable: true })
  categoryId: string;

  @ManyToOne(() => Category, category => category.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'seller_id', nullable: false })
  sellerId: string; // User ID of the seller

  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @Column({ type: 'jsonb', nullable: true })
  attributes: object; // e.g., { color: 'red', size: 'M' }

  @Column({ type: 'jsonb', nullable: true })
  seo: object; // SEO metadata
}
