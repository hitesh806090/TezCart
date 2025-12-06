import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettlementService } from './settlement.service';
import { SettlementController } from './settlement.controller';
import { Payout } from 'db';
import { TenantModule } from '../common/tenant.module';
import { SellerModule } from '../seller/seller.module'; // To get seller profile
import { OrderModule } from '../order/order.module'; // To get seller orders for calculation

@Module({
  imports: [
    TypeOrmModule.forFeature([Payout]),
    TenantModule, // To access TenantProvider for tenantId
    SellerModule, // To access SellerService
    OrderModule, // To access OrderService
  ],
  controllers: [SettlementController],
  providers: [SettlementService],
  exports: [SettlementService], // Export SettlementService
})
export class SettlementModule {}