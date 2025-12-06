import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryPartnerService } from './delivery-partner.service';
import { DeliveryPartnerController } from './delivery-partner.controller';
import { DeliveryPartnerProfile } from 'db';
import { DeliveryPartnerKycDocument } from 'db';
import { TenantModule } from '../common/tenant.module';
import { UserModule } from '../user/user.module';
import { TrackingModule } from '../tracking/tracking.module'; // Import TrackingModule

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliveryPartnerProfile, DeliveryPartnerKycDocument]),
    TenantModule,
    UserModule,
    TrackingModule, // Add TrackingModule
  ],
  controllers: [DeliveryPartnerController],
  providers: [DeliveryPartnerService],
  exports: [DeliveryPartnerService],
})
export class DeliveryPartnerModule {}
