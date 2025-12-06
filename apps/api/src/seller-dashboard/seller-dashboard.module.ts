import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerDashboardService } from './seller-dashboard.service';
import { SellerDashboardController } from './seller-dashboard.controller';
import { Order } from 'db'; // For querying seller orders
import { OrderItem } from 'db'; // For querying order items
import { TenantModule } from '../common/tenant.module'; // Import TenantModule
import { OrderModule } from '../order/order.module'; // To use OrderService to get seller orders

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    TenantModule, // To access TenantProvider for tenantId
    OrderModule, // To use OrderService
  ],
  controllers: [SellerDashboardController],
  providers: [SellerDashboardService],
  exports: [SellerDashboardService],
})
export class SellerDashboardModule {}