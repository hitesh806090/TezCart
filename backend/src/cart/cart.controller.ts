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
    Headers,
    BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto, ApplyCouponDto, MergeCartDto } from './dto/cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('cart')
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    private getUserIdOrSession(req: any, sessionId?: string) {
        const userId = req.user?.userId;
        const session = sessionId || req.headers['x-session-id'];
        return { userId, sessionId: session };
    }

    @Post('items')
    @ApiOperation({ summary: 'Add product to cart (works for both logged-in and guest users)' })
    @ApiHeader({ name: 'x-session-id', required: false, description: 'Session ID for guest users' })
    @ApiResponse({ status: 201, description: 'Product added to cart' })
    @ApiResponse({ status: 400, description: 'Product out of stock or unavailable' })
    async addToCart(
        @Body() addToCartDto: AddToCartDto,
        @Request() req: any,
        @Headers('x-session-id') sessionId?: string,
    ) {
        const { userId, sessionId: session } = this.getUserIdOrSession(req, sessionId);
        return this.cartService.addToCart(addToCartDto, userId, session);
    }

    @Get()
    @ApiOperation({ summary: 'Get my cart' })
    @ApiHeader({ name: 'x-session-id', required: false, description: 'Session ID for guest users' })
    @ApiResponse({ status: 200, description: 'Returns cart with items' })
    getCart(@Request() req: any, @Headers('x-session-id') sessionId?: string) {
        const { userId, sessionId: session } = this.getUserIdOrSession(req, sessionId);
        return this.cartService.getMyCart(userId, session);
    }

    @Get('count')
    @ApiOperation({ summary: 'Get cart item count' })
    @ApiHeader({ name: 'x-session-id', required: false, description: 'Session ID for guest users' })
    @ApiResponse({ status: 200, description: 'Returns item count' })
    async getCartCount(@Request() req: any, @Headers('x-session-id') sessionId?: string) {
        const { userId, sessionId: session } = this.getUserIdOrSession(req, sessionId);
        const count = await this.cartService.getCartItemCount(userId, session);
        return { count };
    }

    @Patch('items/:id')
    @ApiOperation({ summary: 'Update cart item quantity' })
    @ApiHeader({ name: 'x-session-id', required: false, description: 'Session ID for guest users' })
    @ApiResponse({ status: 200, description: 'Cart item updated' })
    @ApiResponse({ status: 400, description: 'Insufficient stock' })
    updateCartItem(
        @Param('id') id: string,
        @Body() updateCartItemDto: UpdateCartItemDto,
        @Request() req: any,
        @Headers('x-session-id') sessionId?: string,
    ) {
        const { userId, sessionId: session } = this.getUserIdOrSession(req, sessionId);
        return this.cartService.updateCartItem(id, updateCartItemDto, userId, session);
    }

    @Delete('items/:id')
    @ApiOperation({ summary: 'Remove item from cart' })
    @ApiHeader({ name: 'x-session-id', required: false, description: 'Session ID for guest users' })
    @ApiResponse({ status: 200, description: 'Item removed from cart' })
    removeCartItem(
        @Param('id') id: string,
        @Request() req: any,
        @Headers('x-session-id') sessionId?: string,
    ) {
        const { userId, sessionId: session } = this.getUserIdOrSession(req, sessionId);
        return this.cartService.removeFromCart(id, userId, session);
    }

    @Delete('clear')
    @ApiOperation({ summary: 'Clear all items from cart' })
    @ApiHeader({ name: 'x-session-id', required: false, description: 'Session ID for guest users' })
    @ApiResponse({ status: 200, description: 'Cart cleared' })
    clearCart(@Request() req: any, @Headers('x-session-id') sessionId?: string) {
        const { userId, sessionId: session } = this.getUserIdOrSession(req, sessionId);
        return this.cartService.clearCart(userId, session);
    }

    @Post('coupon')
    @ApiOperation({ summary: 'Apply coupon code to cart' })
    @ApiHeader({ name: 'x-session-id', required: false, description: 'Session ID for guest users' })
    @ApiResponse({ status: 200, description: 'Coupon applied' })
    @ApiResponse({ status: 400, description: 'Invalid coupon code' })
    applyCoupon(
        @Body() applyCouponDto: ApplyCouponDto,
        @Request() req: any,
        @Headers('x-session-id') sessionId?: string,
    ) {
        const { userId, sessionId: session } = this.getUserIdOrSession(req, sessionId);
        return this.cartService.applyCoupon(applyCouponDto, userId, session);
    }

    @Delete('coupon')
    @ApiOperation({ summary: 'Remove coupon from cart' })
    @ApiHeader({ name: 'x-session-id', required: false, description: 'Session ID for guest users' })
    @ApiResponse({ status: 200, description: 'Coupon removed' })
    removeCoupon(@Request() req: any, @Headers('x-session-id') sessionId?: string) {
        const { userId, sessionId: session } = this.getUserIdOrSession(req, sessionId);
        return this.cartService.removeCoupon(userId, session);
    }

    @Post('merge')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Merge guest cart with user cart after login' })
    @ApiResponse({ status: 200, description: 'Carts merged successfully' })
    mergeCart(@Body() mergeCartDto: MergeCartDto, @Request() req: any) {
        if (!mergeCartDto.sessionId) {
            throw new BadRequestException('Session ID is required for cart merging');
        }
        return this.cartService.mergeCart(req.user.userId, mergeCartDto.sessionId);
    }
}
