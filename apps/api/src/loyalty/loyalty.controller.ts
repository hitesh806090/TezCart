import { Controller, Get, Post, Body, HttpCode, HttpStatus, UseGuards, Request, Param } from '@nestjs/common';
import { LoyaltyService } from './loyalty.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from 'db';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

class AwardPointsDto {
  points: number;
  transactionType: string;
  description: string;
  referenceId?: string;
  orderId?: string;
}

class RedeemPointsDto {
  points: number;
  transactionType: string;
  description: string;
  referenceId?: string;
  orderId?: string;
}

@ApiTags('Loyalty')
@Controller('loyalty')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // All loyalty operations require authentication
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Get('my-points')
  @HttpCode(HttpStatus.OK)
  async getMyLoyaltyPoints(@Request() req: { user: User }) {
    return this.loyaltyService.getUserLoyaltyPoints(req.user.id);
  }

  @Get('my-transactions')
  @HttpCode(HttpStatus.OK)
  async getMyLoyaltyTransactions(@Request() req: { user: User }) {
    return this.loyaltyService.getLoyaltyTransactions(req.user.id);
  }

  // Admin endpoints for awarding/redeeming points (e.g., for promotions, adjustments)
  @Post('admin/award/:userId')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  async adminAwardPoints(@Param('userId') userId: string, @Body() awardDto: AwardPointsDto) {
    return this.loyaltyService.awardPoints(
      userId,
      awardDto.points,
      awardDto.transactionType,
      awardDto.description,
      awardDto.referenceId,
      awardDto.orderId,
    );
  }

  @Post('admin/redeem/:userId')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  async adminRedeemPoints(@Param('userId') userId: string, @Body() redeemDto: RedeemPointsDto) {
    return this.loyaltyService.redeemPoints(
      userId,
      redeemDto.points,
      redeemDto.transactionType,
      redeemDto.description,
      redeemDto.referenceId,
      redeemDto.orderId,
    );
  }
}