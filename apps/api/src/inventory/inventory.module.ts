import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { Product } from 'db'; // Inventory is part of Product entity
import { TenantModule } from '../common/tenant.module'; // Import TenantModule
import { ProductModule } from '../product/product.module'; // Import ProductModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]), // Register Product entity for inventory management
    TenantModule, // To access TenantProvider for tenantId
    ProductModule, // To access ProductService
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService], // Export InventoryService for use elsewhere (e.g., Cart, Order)
})
export class InventoryModule {}