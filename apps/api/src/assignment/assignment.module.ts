import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentService } from './assignment.service';
import { AssignmentController } from './assignment.controller';
import { DeliveryTask } from 'db';
import { ReturnPickupTask } from 'db'; // Import ReturnPickupTask entity
import { TenantModule } from '../common/tenant.module';
import { OrderModule } from '../order/order.module';
import { DeliveryPartnerModule } from '../delivery-partner/delivery-partner.module';
import { AddressModule } from '../address/address.module';
import { OtpModule } from '../otp/otp.module';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { ReturnModule } from '../return/return.module'; // Import ReturnModule

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliveryTask, ReturnPickupTask]), // Register ReturnPickupTask entity
    TenantModule,
    OrderModule,
    DeliveryPartnerModule,
    AddressModule,
    OtpModule,
    FileUploadModule,
    ReturnModule, // Add ReturnModule
  ],
  controllers: [AssignmentController],
  providers: [AssignmentService],
  exports: [AssignmentService],
})
export class AssignmentModule {}