import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { SellerProfile } from 'db';
import { SellerKycDocument } from 'db';
import { TenantModule } from '../common/tenant.module'; // Import TenantModule
import { UserModule } from '../user/user.module'; // Import UserModule

@Module({
  imports: [
    TypeOrmModule.forFeature([SellerProfile, SellerKycDocument]),
    TenantModule, // To access TenantProvider for tenantId
    UserModule, // To validate and associate with User
  ],
  controllers: [SellerController],
  providers: [SellerService],
  exports: [SellerService], // Export SellerService
})
export class SellerModule {}