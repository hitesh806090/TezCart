import { CouponsService } from './coupons.service';
import { CreateCouponDto, UpdateCouponDto, ValidateCouponDto } from './dto/coupon.dto';
export declare class CouponsController {
    private readonly couponsService;
    constructor(couponsService: CouponsService);
    create(createCouponDto: CreateCouponDto): Promise<import("../entities/coupon.entity").Coupon>;
    findAll(): Promise<import("../entities/coupon.entity").Coupon[]>;
    findActive(): Promise<import("../entities/coupon.entity").Coupon[]>;
    validateCoupon(validateDto: ValidateCouponDto, req: any): Promise<{
        valid: boolean;
        discount: number;
        message?: string;
    }>;
    findOne(id: string): Promise<import("../entities/coupon.entity").Coupon>;
    getStats(id: string): Promise<any>;
    update(id: string, updateCouponDto: UpdateCouponDto): Promise<import("../entities/coupon.entity").Coupon>;
    remove(id: string): Promise<void>;
}
