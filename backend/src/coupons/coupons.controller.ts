import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { CreateCouponDto, UpdateCouponDto, ValidateCouponDto } from './dto/coupon.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('coupons')
@Controller('coupons')
export class CouponsController {
    constructor(private readonly couponsService: CouponsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create coupon (Admin only)' })
    @ApiResponse({ status: 201, description: 'Coupon created successfully' })
    @ApiResponse({ status: 400, description: 'Coupon code already exists' })
    create(@Body() createCouponDto: CreateCouponDto) {
        return this.couponsService.create(createCouponDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all coupons (Public)' })
    @ApiResponse({ status: 200, description: 'Returns all coupons' })
    findAll() {
        return this.couponsService.findAll();
    }

    @Get('active')
    @ApiOperation({ summary: 'Get active coupons (Public)' })
    @ApiResponse({ status: 200, description: 'Returns active coupons' })
    findActive() {
        return this.couponsService.findActive();
    }

    @Post('validate')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Validate coupon code' })
    @ApiResponse({ status: 200, description: 'Returns validation result and discount amount' })
    validateCoupon(@Body() validateDto: ValidateCouponDto, @Request() req: any) {
        return this.couponsService.validateCoupon(validateDto, req.user.userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get coupon by ID' })
    @ApiResponse({ status: 200, description: 'Returns the coupon' })
    @ApiResponse({ status: 404, description: 'Coupon not found' })
    findOne(@Param('id') id: string) {
        return this.couponsService.findOne(id);
    }

    @Get(':id/stats')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get coupon statistics (Admin only)' })
    @ApiResponse({ status: 200, description: 'Returns coupon usage stats' })
    getStats(@Param('id') id: string) {
        return this.couponsService.getCouponStats(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update coupon (Admin only)' })
    @ApiResponse({ status: 200, description: 'Coupon updated successfully' })
    update(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
        return this.couponsService.update(id, updateCouponDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete coupon (Admin only)' })
    @ApiResponse({ status: 200, description: 'Coupon deleted successfully' })
    remove(@Param('id') id: string) {
        return this.couponsService.remove(id);
    }
}
