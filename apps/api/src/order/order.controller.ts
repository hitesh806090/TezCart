import { Controller, Get, Post, Put, Param, Body, HttpCode, HttpStatus, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { User } from 'db';
import { Not, IsNull } from 'typeorm'; // Import Not and IsNull

class CreateOrderDto {
  cartId: string;
  addressId: string;
  shippingMethodId: string;
  // Potentially payment information here
}

class UpdateOrderStatusDto {
  status: string;
}

@ApiTags('Orders')
@Controller('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // All order operations require authentication
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req: { user: User }) {
    // This will integrate with the payment gateway later,
    // but for now, it simulates placing an order based on checkout summary.
    // The order service expects totalAmount and currency now. These would come from a confirmed checkout summary.
    // For MVP, using placeholders
    const totalAmount = 1000; // Placeholder
    const currency = 'INR'; // Placeholder
    return this.orderService.createOrderFromCheckout(
      req.user.id,
      createOrderDto.cartId,
      createOrderDto.addressId,
      createOrderDto.shippingMethodId,
      totalAmount,
      currency,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUserOrders(@Request() req: { user: User }) {
    // Customers can view their own parent orders
    return this.orderService.findUserOrders(req.user.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOrderById(@Param('id') id: string, @Request() req: { user: User }) {
    const order = await this.orderService.findOrderById(id);
    // Basic authorization: ensure user can only view their own order or is an admin
    if (order.userId !== req.user.id && req.user.defaultPersona !== 'admin' && req.user.defaultPersona !== 'super_admin') {
      throw new UnauthorizedException('You are not authorized to view this order.');
    }
    return order;
  }
  
  // Endpoint for sellers to view their sub-orders
  @Get('seller/my-orders')
  @UseGuards(RolesGuard)
  @Roles('seller', 'admin', 'super_admin') // Only sellers and admins can access seller orders
  @HttpCode(HttpStatus.OK)
  async getSellerOrders(@Request() req: { user: User }) {
    // Sellers only see their own child orders
    return this.orderService.findSellerOrders(req.user.id);
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin', 'seller') // Admins/Sellers can update order status
  @HttpCode(HttpStatus.OK)
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
    @Request() req: { user: User },
  ) {
    return this.orderService.updateOrderStatus(id, updateStatusDto.status, req.user.id);
  }

  @Put(':id/mark-ready-for-pickup')
  @UseGuards(RolesGuard)
  @Roles('seller', 'admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  async markOrderReadyForPickup(@Param('id') id: string, @Request() req: { user: User }) {
    return this.orderService.markOrderReadyForPickup(id, req.user.id);
  }

  @Get(':id/shipping-label')
  @UseGuards(RolesGuard)
  @Roles('seller', 'admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  async getShippingLabel(@Param('id') id: string, @Request() req: { user: User }) {
    return this.orderService.printShippingLabel(id, req.user.id);
  }
}
