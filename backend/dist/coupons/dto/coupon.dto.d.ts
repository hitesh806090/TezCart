import { DiscountType, CouponStatus } from '../../entities/coupon.entity';
export declare class CreateCouponDto {
    code: string;
    description?: string;
    discountType: DiscountType;
    discountValue: number;
    minOrderAmount?: number;
    maxDiscountAmount?: number;
    maxTotalUses?: number;
    maxUsesPerUser?: number;
    validFrom: string;
    validUntil: string;
    applicableCategories?: string[];
    applicableProducts?: string[];
    excludedProducts?: string[];
    isFirstOrderOnly?: boolean;
}
export declare class UpdateCouponDto {
    description?: string;
    status?: CouponStatus;
    maxTotalUses?: number;
    validUntil?: string;
}
export declare class ValidateCouponDto {
    code: string;
    orderAmount?: number;
}
