import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationTemplate } from 'db';
import { Notification } from 'db';
import { TenantModule } from '../common/tenant.module'; // Import TenantModule
import { UserModule } from '../user/user.module'; // To get user details

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationTemplate, Notification]),
    TenantModule, // To access TenantProvider for tenantId
    UserModule, // To get user details
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService], // Export NotificationService
})
export class NotificationModule {}