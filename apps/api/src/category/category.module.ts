import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category } from 'db';
import { TenantModule } from '../common/tenant.module'; // Import TenantModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    TenantModule, // To access TenantProvider for tenantId
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService], // Export CategoryService for use if needed elsewhere
})
export class CategoryModule {}