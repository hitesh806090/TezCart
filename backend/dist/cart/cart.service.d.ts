import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { Product } from '../entities/product.entity';
import { AddToCartDto, UpdateCartItemDto, ApplyCouponDto } from './dto/cart.dto';
export declare class CartService {
    private cartsRepository;
    private cartItemsRepository;
    private productsRepository;
    constructor(cartsRepository: Repository<Cart>, cartItemsRepository: Repository<CartItem>, productsRepository: Repository<Product>);
    getOrCreateCart(userId?: string, sessionId?: string): Promise<Cart>;
    addToCart(addToCartDto: AddToCartDto, userId?: string, sessionId?: string): Promise<Cart>;
    getCart(cartId: string): Promise<Cart>;
    getMyCart(userId?: string, sessionId?: string): Promise<Cart>;
    updateCartItem(cartItemId: string, updateCartItemDto: UpdateCartItemDto, userId?: string, sessionId?: string): Promise<Cart>;
    removeFromCart(cartItemId: string, userId?: string, sessionId?: string): Promise<Cart>;
    clearCart(userId?: string, sessionId?: string): Promise<void>;
    applyCoupon(applyCouponDto: ApplyCouponDto, userId?: string, sessionId?: string): Promise<Cart>;
    removeCoupon(userId?: string, sessionId?: string): Promise<Cart>;
    mergeCart(userId: string, guestSessionId: string): Promise<Cart>;
    private calculateCartTotals;
    private updateItemsAvailability;
    getCartItemCount(userId?: string, sessionId?: string): Promise<number>;
}
