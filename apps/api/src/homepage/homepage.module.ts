import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomePageService } from './homepage.service';
import { HomePageController } from './homepage.controller';
import { HomePageContent } from 'db';
import { TenantModule } from '../common/tenant.module'; // Import TenantModule
import { ProductModule } from '../product/product.module'; // Import ProductModule
import { CategoryModule } from '../category/category.module'; // Import CategoryModule

@Module({
  imports: [
    TypeOrmModule.forFeature([HomePageContent]),
    TenantModule, // To access TenantProvider for tenantId
    ProductModule, // To fetch product data for dynamic sections
    CategoryModule, // To fetch category data for dynamic sections
  ],
  controllers: [HomePageController],
  providers: [HomePageService],
  exports: [HomePageService], // Export HomePageService for use if needed elsewhere
})
export class HomePageModule {}