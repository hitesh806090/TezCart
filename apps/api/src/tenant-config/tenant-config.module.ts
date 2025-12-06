import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantConfigService } from './tenant-config.service';
import { TenantConfigController } from './tenant-config.controller';
import { Tenant } from 'db'; // Import Tenant entity from db package

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])], // Register Tenant entity
  controllers: [TenantConfigController],
  providers: [TenantConfigService],
  exports: [TenantConfigService] // Export if other modules need to access it
})
export class TenantConfigModule {}