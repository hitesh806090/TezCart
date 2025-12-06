import { Module } from '@nestjs/common';
import { TrackingGateway } from './tracking.gateway';
import { OrderModule } from '../order/order.module'; // Import OrderModule
import { DeliveryPartnerModule } from '../delivery-partner/delivery-partner.module'; // Import DeliveryPartnerModule
import { TenantModule } from '../common/tenant.module'; // Import TenantModule

@Module({
  imports: [
    OrderModule, // To access OrderService
    DeliveryPartnerModule, // To access DeliveryPartnerService
    TenantModule, // To access TenantProvider
  ],
  providers: [TrackingGateway],
  exports: [TrackingGateway], // Export the gateway to be used by other modules (e.g., AppModule)
})
export class TrackingModule {}