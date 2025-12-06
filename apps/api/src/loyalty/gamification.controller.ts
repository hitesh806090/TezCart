import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '..//auth/guards/jwt-auth.guard';
import { RolesGuard } from '..//common/guards/roles.guard';
import { Roles } from '..//common/decorators/roles.decorator';
import { User } from 'db';

class CreateBadgeDto {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  awardCriteria: string;
  criteriaDetails?: object;
  status?: string;
  rewards?: object;
}

class CreateMissionDto {
  name: string;
  slug: string;
  description?: string;
  type: string;
  validFrom: Date;
  validUntil: Date;
  status?: string;
  conditions?: object;
  rewards?: object;
}

class CreateReferralDto {
  referralCode?: string;
}

@ApiTags('Gamification')
@Controller('gamification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard) // All gamification operations require authentication and roles
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  // --- User Endpoints ---
  @Get('my-badges')
  @Roles('customer', 'seller', 'delivery_partner', 'admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  getUserBadges(@Request() req: { user: User }) {
    return this.gamificationService.getUserBadges(req.user.id);
  }

  @Get('my-missions')
  @Roles('customer', 'seller', 'delivery_partner', 'admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  getUserMissions(@Request() req: { user: User }) {
    return this.gamificationService.getUserMissions(req.user.id);
  }

  @Post('missions/:missionId/start')
  @Roles('customer', 'seller', 'delivery_partner', 'admin', 'super_admin')
  @HttpCode(HttpStatus.CREATED)
  startMission(@Param('missionId') missionId: string, @Request() req: { user: User }) {
    return this.gamificationService.startMission(req.user.id, missionId);
  }

  @Post('my-referral')
  @Roles('customer', 'seller', 'delivery_partner', 'admin', 'super_admin')
  @HttpCode(HttpStatus.CREATED)
  createReferral(@Body() createReferralDto: CreateReferralDto, @Request() req: { user: User }) {
    return this.gamificationService.createReferral(req.user.id, createReferralDto.referralCode);
  }

  @Get('my-referral')
  @Roles('customer', 'seller', 'delivery_partner', 'admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  getReferralStatus(@Request() req: { user: User }) {
    return this.gamificationService.getReferralStatus(req.user.id);
  }

  @Post('process-referred-user/:referralCode')
  @Roles('customer', 'seller', 'delivery_partner', 'admin', 'super_admin') // Any new user who was referred
  @HttpCode(HttpStatus.OK)
  processReferredUser(@Param('referralCode') referralCode: string, @Request() req: { user: User }) {
    return this.gamificationService.processReferredUserSignup(req.user.id, referralCode);
  }


  // --- Admin Endpoints ---
  @Post('admin/badges')
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.CREATED)
  createBadge(@Body() createBadgeDto: CreateBadgeDto) {
    return this.gamificationService.createBadge(createBadgeDto);
  }

  @Post('admin/award-badge/:userId')
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.CREATED)
  awardBadge(@Param('userId') userId: string, @Body('badgeId') badgeId: string, @Body('reason') reason?: string) {
    return this.gamificationService.awardBadgeToUser(userId, badgeId, reason);
  }

  @Post('admin/missions')
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.CREATED)
  createMission(@Body() createMissionDto: CreateMissionDto) {
    return this.gamificationService.createMission(createMissionDto);
  }
}
