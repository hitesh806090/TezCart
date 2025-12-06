import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { Campaign } from 'db';
import { CampaignProduct } from 'db';
import { TenantModule } from '../common/tenant.module'; // Import TenantModule
import { ProductModule } from '../product/product.module'; // To link products
import { CategoryModule } from '../category/category.module'; // To link categories

@Module({
  imports: [
    TypeOrmModule.forFeature([Campaign, CampaignProduct]),
    TenantModule, // To access TenantProvider for tenantId
    ProductModule, // To validate products
    CategoryModule, // To validate categories
  ],
  controllers: [CampaignController],
  providers: [CampaignService],
  exports: [CampaignService], // Export CampaignService
})
export class CampaignModule {}