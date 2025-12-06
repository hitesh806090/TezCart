import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, UseGuards, Request, UnauthorizedException, Query } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '..//auth/guards/jwt-auth.guard';
import { RolesGuard } from '..//common/guards/roles.guard';
import { Roles } from '..//common/decorators/roles.decorator';
import { User } from 'db';

class CreateCouponDto {
  code?: string;
  type: string;
  value: number;
  maxDiscountAmount?: number;
  validFrom: Date;
  validUntil: Date;
  sellerId?: string; // Optional, for seller-specific coupons
  usageLimit?: number;
  usageLimitPerUser?: number;
  rules?: object;
  isActive?: boolean;
  metadata?: object;
}

class UpdateCouponDto {
  code?: string;
  type?: string;
  value?: number;
  maxDiscountAmount?: number;
  validFrom?: Date;
  validUntil?: Date;
  sellerId?: string;
  usageLimit?: number;
  usageLimitPerUser?: number;
  rules?: object;
  isActive?: boolean;
  metadata?: object;
}

@ApiTags('Coupons')
@Controller('coupons')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @Roles('admin', 'super_admin', 'seller') // Admins create platform coupons, sellers create their own
  @HttpCode(HttpStatus.CREATED)
  async createCoupon(@Body() createCouponDto: CreateCouponDto, @Request() req: { user: User }) {
    if (req.user.defaultPersona === 'seller' && createCouponDto.sellerId && createCouponDto.sellerId !== req.user.id) {
        throw new UnauthorizedException('Sellers can only create coupons for themselves.');
    }
    if (req.user.defaultPersona === 'seller' && !createCouponDto.sellerId) {
        createCouponDto.sellerId = req.user.id; // Auto-assign seller ID if seller creates without specifying
    }
    
    return this.couponService.createCoupon(createCouponDto, req.user.id);
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  // Publicly accessible for validation during checkout etc., or by authenticated users
  findCouponByCode(@Param('code') code: string) {
    return this.couponService.findCouponByCode(code);
  }

  @Get('seller/my-coupons')
  @Roles('seller', 'admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  getSellerCoupons(@Request() req: { user: User }) {
    if (req.user.defaultPersona === 'seller') {
        return this.couponService.getCouponsForSeller(req.user.id);
    }
    // Admin/SuperAdmin logic to view all seller coupons or filter by sellerId (not implemented yet)
    throw new UnauthorizedException('Admin/SuperAdmin view not implemented yet.');
  }

  @Get('platform')
  @HttpCode(HttpStatus.OK)
  getPlatformCoupons() {
    return this.couponService.getPlatformCoupons();
  }

  @Put(':id')
  @Roles('admin', 'super_admin', 'seller')
  @HttpCode(HttpStatus.OK)
  async updateCoupon(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto, @Request() req: { user: User }) {
    // Authorization: Only owner seller or admin can update
    const coupon = await this.couponService.couponRepository.findOne({ where: { id, tenantId: req.user.tenantId } });
    if (!coupon) {
        throw new NotFoundException('Coupon not found.');
    }
    if (req.user.defaultPersona === 'seller' && coupon.sellerId !== req.user.id) {
        throw new UnauthorizedException('You are not authorized to update this coupon.');
    }
    return this.couponService.updateCoupon(id, updateCouponDto);
  }

  @Delete(':id')
  @Roles('admin', 'super_admin', 'seller')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCoupon(@Param('id') id: string, @Request() req: { user: User }) {
    // Authorization: Only owner seller or admin can delete
    const coupon = await this.couponService.couponRepository.findOne({ where: { id, tenantId: req.user.tenantId } });
    if (!coupon) {
        throw new NotFoundException('Coupon not found.');
    }
    if (req.user.defaultPersona === 'seller' && coupon.sellerId !== req.user.id) {
        throw new UnauthorizedException('You are not authorized to delete this coupon.');
    }
    return this.couponService.deleteCoupon(id);
  }
}
