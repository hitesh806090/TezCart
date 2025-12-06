import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { ShippingMethod } from 'db';
import { TenantModule } from '../common/tenant.module';
import { CartModule } from '../cart/cart.module';
import { AddressModule } from '../address/address.module';
import { ProductModule } from '../product/product.module';
import { InventoryModule } from '../inventory/inventory.module';
import { TenantConfigModule } from '../tenant-config/tenant-config.module';
import { PaymentModule } from '../payment/payment.module';
import { LoyaltyModule } from '../loyalty/loyalty.module'; // Import LoyaltyModule

@Module({
  imports: [
    TypeOrmModule.forFeature([ShippingMethod]),
    TenantModule,
    CartModule,
    AddressModule,
    ProductModule,
    InventoryModule,
    TenantConfigModule,
    PaymentModule,
    LoyaltyModule, // Add LoyaltyModule
  ],
  controllers: [CheckoutController],
  providers: [CheckoutService],
  exports: [CheckoutService],
})
export class CheckoutModule {}
