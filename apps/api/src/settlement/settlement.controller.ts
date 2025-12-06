import { Controller, Get, Post, Put, Param, Body, HttpCode, HttpStatus, UseGuards, Request, Query } from '@nestjs/common';
import { SettlementService } from './settlement.service';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { User } from 'db';

class UpdateSellerBankDetailsDto {
  bankAccountName: string;
  bankAccountNumber: string;
  ifscCode: string;
}

class GeneratePayoutDto {
  periodStart: string; // ISO date string
  periodEnd: string; // ISO date string
}

@ApiTags('Settlement & Payouts')
@Controller('settlement')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettlementController {
  constructor(private readonly settlementService: SettlementService) {}

  @Get('my-payouts')
  @Roles('seller', 'admin', 'super_admin') // Sellers can view their own, admins can view all (with filters)
  @ApiQuery({ name: 'sellerId', required: false, type: String, description: 'Filter by seller ID (Admin only)' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Start date (ISO format)' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'End date (ISO format)' })
  async getMyPayouts(
    @Request() req: { user: User },
    @Query('sellerId') querySellerId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    let sellerIdToQuery = req.user.id;
    if (req.user.defaultPersona === 'admin' || req.user.defaultPersona === 'super_admin') {
      sellerIdToQuery = querySellerId || req.user.id; // Admin can query other sellers
    } else if (querySellerId && querySellerId !== req.user.id) {
        throw new UnauthorizedException('You can only view your own payouts.');
    }

    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    return this.settlementService.getSellerPayoutHistory(sellerIdToQuery, start, end);
  }

  @Put('my-bank-details')
  @Roles('seller') // Only sellers can update their bank details
  async updateMyBankDetails(@Body() updateDto: UpdateSellerBankDetailsDto, @Request() req: { user: User }) {
    return this.settlementService.updateSellerBankAccount(
      req.user.id,
      updateDto.bankAccountName,
      updateDto.bankAccountNumber,
      updateDto.ifscCode,
    );
  }

  // --- Admin/System Endpoints ---
  // This endpoint would typically be called by a cron job or admin action
  @Post('admin/generate-payout/:sellerId')
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.CREATED)
  async generatePayout(
    @Param('sellerId') sellerId: string,
    @Body() generatePayoutDto: GeneratePayoutDto,
  ) {
    const periodStart = new Date(generatePayoutDto.periodStart);
    const periodEnd = new Date(generatePayoutDto.periodEnd);
    return this.settlementService.calculateAndCreatePayout(sellerId, periodStart, periodEnd);
  }
}