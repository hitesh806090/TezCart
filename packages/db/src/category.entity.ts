import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('categories')
@Index(['slug', 'tenantId'], { unique: true }) // Slug must be unique per tenant
@Index(['parentId', 'tenantId'])
export class Category extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  slug: string; // URL-friendly identifier

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true, name: 'parent_id' })
  parentId: string;

  @ManyToOne(() => Category, category => category.children, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @OneToMany(() => Category, category => category.parent)
  children: Category[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  seo: object; // SEO metadata (title, description, keywords)
}
