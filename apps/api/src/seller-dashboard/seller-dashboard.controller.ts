import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { SellerDashboardService } from './seller-dashboard.service';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { User } from 'db';

@ApiTags('Seller Dashboard')
@Controller('seller-dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('seller', 'admin', 'super_admin') // Only sellers or admins can access this dashboard
export class SellerDashboardController {
  constructor(private readonly sellerDashboardService: SellerDashboardService) {}

  @Get('metrics')
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Start date (ISO format)' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'End date (ISO format)' })
  async getSellerMetrics(
    @Request() req: { user: User },
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.sellerDashboardService.getSellerMetrics(req.user.id, start, end);
  }

  @Get('orders-overview')
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Start date (ISO format)' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'End date (ISO format)' })
  async getSellerOrdersOverview(
    @Request() req: { user: User },
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.sellerDashboardService.getSellerOrdersOverview(req.user.id, start, end);
  }
}