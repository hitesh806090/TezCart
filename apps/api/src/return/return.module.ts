import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReturnService } from './return.service';
import { ReturnController } from './return.controller';
import { ReturnReason } from 'db';
import { ReturnRequest } from 'db';
import { ReturnItem } from 'db';
import { TenantModule } from '../common/tenant.module';
import { OrderModule } from '../order/order.module';
import { ProductModule } from '../product/product.module';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { AssignmentModule } from '../assignment/assignment.module';
import { WalletModule } from '../wallet/wallet.module'; // Import WalletModule
import { PaymentModule } from '../payment/payment.module'; // Import PaymentModule

@Module({
  imports: [
    TypeOrmModule.forFeature([ReturnReason, ReturnRequest, ReturnItem]),
    TenantModule,
    OrderModule,
    ProductModule,
    FileUploadModule,
    AssignmentModule,
    WalletModule, // Add WalletModule
    PaymentModule, // Add PaymentModule
  ],
  controllers: [ReturnController],
  providers: [ReturnService],
  exports: [ReturnService],
})
export class ReturnModule {}