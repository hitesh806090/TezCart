import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Campaign } from './campaign.entity';
import { Product } from './product.entity';

@Entity('campaign_products')
@Index(['campaignId', 'productId', 'tenantId'], { unique: true })
export class CampaignProduct extends BaseEntity {
  @Column({ name: 'campaign_id', nullable: false })
  campaignId: string;

  @ManyToOne(() => Campaign, campaign => campaign.campaignProducts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'campaign_id' })
  campaign: Campaign;

  @Column({ name: 'product_id', nullable: false })
  productId: string;

  @ManyToOne(() => Product, product => product.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  campaignPrice: number; // Price of the product during the campaign

  @Column({ type: 'int', nullable: true })
  campaignStock: number; // Dedicated stock for the campaign

  @Column({ type: 'int', nullable: true })
  maxPurchasePerUser: number; // Limit purchase per user during campaign

  @Column({ type: 'jsonb', nullable: true })
  metadata: object; // Additional product-specific campaign data
}
