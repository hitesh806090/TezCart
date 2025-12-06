import { Controller, Get, Query, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsSyncService } from './analytics-sync.service';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Analytics')
@Controller('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly analyticsSyncService: AnalyticsSyncService,
  ) {}

  @Get('admin/stats')
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  async getEventStats(
    @Query('eventType') eventType: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    const count = await this.analyticsService.getEventCounts(eventType, start, end);
    return { eventType, count };
  }

  // Manually trigger sync for testing/admin purposes
  @Post('admin/trigger-sync')
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  async triggerSync() {
    await this.analyticsSyncService.syncDailyMetrics();
    return { message: 'Analytics sync triggered.' };
  }

  // --- New Dashboard Endpoints ---

  @Get('admin/dashboard/platform')
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  async getPlatformDashboard(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    // In a real scenario, this would query the aggregated tables (DailySalesMetric)
    // For MVP, we can fetch from the service which might query raw data or aggregations
    // Placeholder response
    return {
      totalGmv: 150000,
      totalOrders: 1200,
      activeUsers: 500,
      revenue: 15000, // Platform revenue (commissions)
      period: { start, end }
    };
  }

  @Get('seller/dashboard/metrics')
  @Roles('seller', 'admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  async getSellerMetrics(
    @Query('sellerId') sellerId: string, // Admin can pass sellerId, seller uses their own
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    // Logic to fetch seller-specific metrics
    return {
        totalSales: 5000,
        totalOrders: 50,
        topProducts: []
    };
  }
}
