import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from 'db';
import { OrderItem } from 'db';
import { TenantModule } from '../common/tenant.module';
import { CartModule } from '../cart/cart.module';
import { AddressModule } from '../address/address.module';
import { InventoryModule } from '../inventory/inventory.module';
import { CheckoutModule } from '../checkout/checkout.module';
import { AssignmentModule } from '../assignment/assignment.module';
import { TrackingModule } from '../tracking/tracking.module';
import { LoyaltyModule } from '../loyalty/loyalty.module';
import { NotificationModule } from '../notification/notification.module'; // Import NotificationModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    TenantModule,
    CartModule,
    AddressModule,
    InventoryModule,
    CheckoutModule,
    AssignmentModule,
    TrackingModule,
    LoyaltyModule,
    NotificationModule, // Add NotificationModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}