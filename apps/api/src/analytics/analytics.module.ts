import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsEvent } from 'db';
import { DailySalesMetric } from 'db';
import { ProductMetric } from 'db';
import { Order } from 'db';
import { Tenant } from 'db';
import { TenantModule } from '../common/tenant.module';
import { AnalyticsSyncService } from './analytics-sync.service'; // Import Sync Service

@Module({
  imports: [
    TypeOrmModule.forFeature([AnalyticsEvent, DailySalesMetric, ProductMetric, Order, Tenant]), // Register entities
    TenantModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, AnalyticsSyncService], // Add Sync Service
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
