export declare enum DiscountType {
    PERCENTAGE = "percentage",
    FIXED_AMOUNT = "fixed_amount",
    FREE_SHIPPING = "free_shipping"
}
export declare enum CouponStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    EXPIRED = "expired"
}
export declare class Coupon {
    id: string;
    code: string;
    description: string;
    discountType: DiscountType;
    discountValue: number;
    minOrderAmount: number;
    maxDiscountAmount: number;
    maxTotalUses: number;
    maxUsesPerUser: number;
    currentUses: number;
    validFrom: Date;
    validUntil: Date;
    applicableCategories: string[];
    applicableProducts: string[];
    excludedProducts: string[];
    isFirstOrderOnly: boolean;
    status: CouponStatus;
    createdAt: Date;
    updatedAt: Date;
}
