import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, UseGuards, Request, Headers } from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from 'db';

class AddItemToCartDto {
  productId: string;
  quantity: number;
  attributes?: object;
}

class UpdateCartItemQuantityDto {
  quantity: number;
}

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Helper to get cart ID for authenticated or guest user
  private async getCartId(req: { user?: User; headers: Record<string, string> }): Promise<{ cartId: string; newSessionId?: string }> {
    const userId = req.user?.id;
    let sessionId = req.headers['x-guest-session-id']; // Guest session ID passed in header

    let cart: any;
    if (userId) {
      // If user is authenticated and has a guest session, merge carts
      if (sessionId) {
        cart = await this.cartService.mergeCarts(sessionId, userId);
        // Clear guest session ID from client side after merge
        return { cartId: cart.id, newSessionId: undefined };
      }
      cart = await this.cartService.getOrCreateCart(userId);
    } else {
      cart = await this.cartService.getOrCreateCart(undefined, sessionId);
      if (!sessionId) { // If it was a new guest cart, return the new sessionId
        return { cartId: cart.id, newSessionId: cart.sessionId };
      }
    }
    return { cartId: cart.id };
  }


  @Get()
  @UseGuards(JwtAuthGuard) // Guard is optional here, will handle guests without user object
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async getCart(@Request() req: { user?: User; headers: Record<string, string> }) {
    const { cartId, newSessionId } = await this.getCartId(req);
    const cartDetails = await this.cartService.getCartWithDetails(cartId);
    
    // If a new guest session was created, return it in the header for client to store
    if (newSessionId) {
        (req.res as any).header('X-New-Guest-Session-Id', newSessionId);
    }
    return cartDetails;
  }

  @Post('items')
  @UseGuards(JwtAuthGuard) // Guard is optional here
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  async addItem(@Body() addItemDto: AddItemToCartDto, @Request() req: { user?: User; headers: Record<string, string> }) {
    const { cartId, newSessionId } = await this.getCartId(req);
    const updatedCart = await this.cartService.addItemToCart(cartId, addItemDto.productId, addItemDto.quantity, addItemDto.attributes);
    if (newSessionId) {
        (req.res as any).header('X-New-Guest-Session-Id', newSessionId);
    }
    return updatedCart;
  }

  @Put('items/:itemId')
  @UseGuards(JwtAuthGuard) // Guard is optional here
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async updateItemQuantity(@Param('itemId') itemId: string, @Body() updateDto: UpdateCartItemQuantityDto, @Request() req: { user?: User; headers: Record<string, string> }) {
    const { cartId } = await this.getCartId(req); // Need cartId to ensure correct cart
    return this.cartService.updateItemQuantity(cartId, itemId, updateDto.quantity);
  }

  @Delete('items/:itemId')
  @UseGuards(JwtAuthGuard) // Guard is optional here
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeItem(@Param('itemId') itemId: string, @Request() req: { user?: User; headers: Record<string, string> }) {
    const { cartId } = await this.getCartId(req);
    return this.cartService.removeItemFromCart(cartId, itemId);
  }

  @Delete('clear')
  @UseGuards(JwtAuthGuard) // Guard is optional here
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearCart(@Request() req: { user?: User; headers: Record<string, string> }) {
    const { cartId } = await this.getCartId(req);
    return this.cartService.clearCart(cartId);
  }
}