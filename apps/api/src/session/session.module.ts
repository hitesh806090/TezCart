import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { UserSession } from 'db';
import { TenantModule } from '../common/tenant.module'; // Import TenantModule

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSession]),
    TenantModule, // To access TenantProvider for tenantId
  ],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService], // Export SessionService for use in AuthModule
})
export class SessionModule {}