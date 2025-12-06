import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { Address } from 'db';
import { TenantModule } from '../common/tenant.module'; // Import TenantModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Address]),
    TenantModule, // To access TenantProvider for tenantId
  ],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService], // Export AddressService for use if needed elsewhere
})
export class AddressModule {}