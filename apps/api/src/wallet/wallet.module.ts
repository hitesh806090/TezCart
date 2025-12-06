import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { Wallet } from 'db';
import { WalletTransaction } from 'db';
import { TenantModule } from '../common/tenant.module'; // Import TenantModule
import { UserModule } from '../user/user.module'; // To create wallet for user

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, WalletTransaction]),
    TenantModule, // To access TenantProvider for tenantId
    UserModule, // To get user details
  ],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService], // Export WalletService for use in other modules (e.g., ReturnService)
})
export class WalletModule {}