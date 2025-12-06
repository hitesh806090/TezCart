import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from 'db';
import { ProductAlert } from 'db'; // Import ProductAlert entity
import { TenantModule } from '../common/tenant.module';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';
import { SearchModule } from '../search/search.module';
import { InventoryModule } from '../inventory/inventory.module';
import { NotificationModule } from '../notification/notification.module'; // Import NotificationModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductAlert]), // Register ProductAlert entity
    TenantModule,
    UserModule,
    CategoryModule,
    SearchModule,
    InventoryModule,
    NotificationModule, // For sending notifications
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}