export declare class AddToCartDto {
    productId: string;
    quantity: number;
}
export declare class UpdateCartItemDto {
    quantity: number;
}
export declare class ApplyCouponDto {
    couponCode: string;
}
export declare class MergeCartDto {
    sessionId?: string;
}
