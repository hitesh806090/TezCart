import {
    Controller,
    Get,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get('admin/dashboard')
    @ApiOperation({ summary: 'Get admin dashboard analytics (Admin only)' })
    @ApiQuery({ name: 'dateFrom', required: false, example: '2025-01-01' })
    @ApiQuery({ name: 'dateTo', required: false, example: '2025-12-31' })
    @ApiResponse({ status: 200, description: 'Returns admin dashboard data' })
    getAdminDashboard(
        @Query('dateFrom') dateFrom?: string,
        @Query('dateTo') dateTo?: string,
    ) {
        const from = dateFrom ? new Date(dateFrom) : undefined;
        const to = dateTo ? new Date(dateTo) : undefined;
        return this.analyticsService.getAdminDashboard(from, to);
    }

    @Get('seller/dashboard')
    @ApiOperation({ summary: 'Get seller dashboard analytics' })
    @ApiQuery({ name: 'dateFrom', required: false, example: '2025-01-01' })
    @ApiQuery({ name: 'dateTo', required: false, example: '2025-12-31' })
    @ApiResponse({ status: 200, description: 'Returns seller dashboard data' })
    getSellerDashboard(
        @Request() req: any,
        @Query('dateFrom') dateFrom?: string,
        @Query('dateTo') dateTo?: string,
    ) {
        const from = dateFrom ? new Date(dateFrom) : undefined;
        const to = dateTo ? new Date(dateTo) : undefined;
        return this.analyticsService.getSellerDashboard(req.user.userId, from, to);
    }

    @Get('sales-report')
    @ApiOperation({ summary: 'Get sales report (Admin only)' })
    @ApiQuery({ name: 'dateFrom', required: true, example: '2025-01-01' })
    @ApiQuery({ name: 'dateTo', required: true, example: '2025-12-31' })
    @ApiResponse({ status: 200, description: 'Returns sales report' })
    getSalesReport(
        @Query('dateFrom') dateFrom: string,
        @Query('dateTo') dateTo: string,
    ) {
        return this.analyticsService.getSalesReport(new Date(dateFrom), new Date(dateTo));
    }
}
