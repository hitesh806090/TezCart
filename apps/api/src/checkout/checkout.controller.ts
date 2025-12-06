import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { User } from 'db';

class CreateShippingMethodDto {
  name: string;
  description?: string;
  baseCost: number;
  rules?: object;
  isActive?: boolean;
}

class UpdateShippingMethodDto {
  name?: string;
  description?: string;
  baseCost?: number;
  rules?: object;
  isActive?: boolean;
}

class ProcessCheckoutDto {
  cartId: string;
  addressId: string;
  shippingMethodId: string;
  paymentMethod: string;
  pointsToRedeem?: number; // Add points to redeem
}

@ApiTags('Checkout')
@Controller('checkout')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // All checkout operations require authentication
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Get('summary')
  @HttpCode(HttpStatus.OK)
  async getCheckoutSummary(
    @Request() req: { user: User },
    @Body('cartId') cartId: string,
    @Body('addressId') addressId?: string,
    @Body('shippingMethodId') shippingMethodId?: string,
    @Body('pointsToRedeem') pointsToRedeem: number = 0, // Get points to redeem
  ) {
    return this.checkoutService.getCheckoutSummary(req.user.id, cartId, addressId, shippingMethodId, pointsToRedeem);
  }

  @Post('process')
  @HttpCode(HttpStatus.OK)
  async processCheckout(@Body() processDto: ProcessCheckoutDto, @Request() req: { user: User }) {
    return this.checkoutService.processCheckout(
      req.user.id,
      processDto.cartId,
      processDto.addressId,
      processDto.shippingMethodId,
      processDto.paymentMethod,
      processDto.pointsToRedeem || 0, // Pass points to redeem
    );
  }

  // --- Admin Endpoints for Shipping Methods ---
  @Post('admin/shipping-methods')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.CREATED)
  createShippingMethod(@Body() createDto: CreateShippingMethodDto) {
    return this.checkoutService.createShippingMethod(createDto);
  }

  @Get('admin/shipping-methods')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  findAllShippingMethods() {
    return this.checkoutService.findAllShippingMethods();
  }

  @Get('admin/shipping-methods/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  findShippingMethodById(@Param('id') id: string) {
    return this.checkoutService.findShippingMethodById(id);
  }

  @Put('admin/shipping-methods/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  updateShippingMethod(@Param('id') id: string, @Body() updateDto: UpdateShippingMethodDto) {
    return this.checkoutService.shippingMethodRepository.update(id, updateDto);
  }

  @Delete('admin/shipping-methods/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteShippingMethod(@Param('id') id: string) {
    return this.checkoutService.shippingMethodRepository.delete(id);
  }
}