import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto, ApplyCouponDto, MergeCartDto } from './dto/cart.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    private getUserIdOrSession;
    addToCart(addToCartDto: AddToCartDto, req: any, sessionId?: string): Promise<import("../entities/cart.entity").Cart>;
    getCart(req: any, sessionId?: string): Promise<import("../entities/cart.entity").Cart>;
    getCartCount(req: any, sessionId?: string): Promise<{
        count: number;
    }>;
    updateCartItem(id: string, updateCartItemDto: UpdateCartItemDto, req: any, sessionId?: string): Promise<import("../entities/cart.entity").Cart>;
    removeCartItem(id: string, req: any, sessionId?: string): Promise<import("../entities/cart.entity").Cart>;
    clearCart(req: any, sessionId?: string): Promise<void>;
    applyCoupon(applyCouponDto: ApplyCouponDto, req: any, sessionId?: string): Promise<import("../entities/cart.entity").Cart>;
    removeCoupon(req: any, sessionId?: string): Promise<import("../entities/cart.entity").Cart>;
    mergeCart(mergeCartDto: MergeCartDto, req: any): Promise<import("../entities/cart.entity").Cart>;
}
