import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    UseGuards,
    Request,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import {
    CreateOrderDto,
    UpdateOrderStatusDto,
    AddTrackingDto,
    CancelOrderDto,
    OrderQueryDto,
} from './dto/order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post('checkout')
    @ApiOperation({ summary: 'Create order from cart (checkout)' })
    @ApiResponse({ status: 201, description: 'Order created successfully' })
    @ApiResponse({ status: 400, description: 'Cart is empty or items unavailable' })
    createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req: any) {
        return this.ordersService.createOrder(createOrderDto, req.user.userId);
    }

    @Get('my-orders')
    @ApiOperation({ summary: 'Get my orders' })
    @ApiResponse({ status: 200, description: 'Returns user orders' })
    getMyOrders(@Request() req: any, @Query() query: OrderQueryDto) {
        return this.ordersService.getMyOrders(req.user.userId, query);
    }

    @Get('seller-orders')
    @ApiOperation({ summary: 'Get orders for my products (Seller only)' })
    @ApiResponse({ status: 200, description: 'Returns seller orders' })
    getSellerOrders(@Request() req: any, @Query() query: OrderQueryDto) {
        return this.ordersService.getSellerOrders(req.user.userId, query);
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get order statistics' })
    @ApiResponse({ status: 200, description: 'Returns order stats' })
    getStats(@Request() req: any) {
        const isSeller = req.user.role === 'seller';
        return this.ordersService.getOrderStats(
            isSeller ? undefined : req.user.userId,
            isSeller ? req.user.userId : undefined,
        );
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order by ID' })
    @ApiParam({ name: 'id', description: 'Order ID' })
    @ApiResponse({ status: 200, description: 'Returns the order' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }

    @Get('number/:orderNumber')
    @ApiOperation({ summary: 'Get order by order number' })
    @ApiParam({ name: 'orderNumber', description: 'Order number (e.g., ORD-202512-000001)' })
    @ApiResponse({ status: 200, description: 'Returns the order' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    findByOrderNumber(@Param('orderNumber') orderNumber: string) {
        return this.ordersService.findByOrderNumber(orderNumber);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Update order status (Admin/Seller only)' })
    @ApiParam({ name: 'id', description: 'Order ID' })
    @ApiResponse({ status: 200, description: 'Order status updated' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    updateStatus(
        @Param('id') id: string,
        @Body() updateStatusDto: UpdateOrderStatusDto,
        @Request() req: any,
    ) {
        return this.ordersService.updateStatus(id, updateStatusDto, req.user.role);
    }

    @Post(':id/tracking')
    @ApiOperation({ summary: 'Add tracking information (Admin/Seller only)' })
    @ApiParam({ name: 'id', description: 'Order ID' })
    @ApiResponse({ status: 200, description: 'Tracking added successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    addTracking(
        @Param('id') id: string,
        @Body() addTrackingDto: AddTrackingDto,
        @Request() req: any,
    ) {
        return this.ordersService.addTracking(id, addTrackingDto, req.user.role);
    }

    @Post(':id/cancel')
    @ApiOperation({ summary: 'Cancel order' })
    @ApiParam({ name: 'id', description: 'Order ID' })
    @ApiResponse({ status: 200, description: 'Order cancelled successfully' })
    @ApiResponse({ status: 400, description: 'Cannot cancel shipped/delivered order' })
    cancelOrder(
        @Param('id') id: string,
        @Body() cancelOrderDto: CancelOrderDto,
        @Request() req: any,
    ) {
        return this.ordersService.cancelOrder(id, cancelOrderDto, req.user.userId, req.user.role);
    }
}
