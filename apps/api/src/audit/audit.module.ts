import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditService } from './audit.service';
import { AuditLog } from 'db';
import { AuditInterceptor } from './interceptors/audit.interceptor';
import { TenantModule } from '../common/tenant.module'; // Import TenantModule to get TenantProvider

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditLog]), // Register AuditLog entity
    TenantModule, // Import TenantModule to inject TenantProvider into AuditInterceptor
  ],
  providers: [
    AuditService,
    AuditInterceptor, // Interceptors can be provided here, but often globally
  ],
  exports: [AuditService], // Export AuditService if other modules need to use it directly
})
export class AuditModule {}