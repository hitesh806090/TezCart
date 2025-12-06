import { Entity, Column, Index, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CampaignProduct } from './campaign-product.entity';

@Entity('campaigns')
@Index(['tenantId', 'slug'], { unique: true })
@Index(['tenantId', 'status'])
@Index(['tenantId', 'validFrom', 'validUntil'])
export class Campaign extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  slug: string; // URL-friendly identifier

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: false })
  type: string; // e.g., 'flash_sale', 'time_bound_discount', 'category_campaign'

  @Column({ type: 'timestamp', nullable: false })
  validFrom: Date;

  @Column({ type: 'timestamp', nullable: false })
  validUntil: Date;

  @Column({ nullable: false, default: 'draft' })
  status: string; // e.g., 'draft', 'scheduled', 'active', 'ended', 'cancelled'

  @Column({ type: 'jsonb', nullable: true })
  rules: object; // JSONB for campaign-specific rules (e.g., global discount %, target categories, min purchase)

  @Column({ nullable: true })
  bannerImageUrl: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: object; // Additional campaign data

  @OneToMany(() => CampaignProduct, cp => cp.campaign)
  campaignProducts: CampaignProduct[];
}
