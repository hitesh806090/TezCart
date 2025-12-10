import { Repository } from 'typeorm';
import { Coupon } from '../entities/coupon.entity';
import { CouponUsage } from '../entities/coupon-usage.entity';
import { Order } from '../entities/order.entity';
import { CreateCouponDto, UpdateCouponDto, ValidateCouponDto } from './dto/coupon.dto';
export declare class CouponsService {
    private couponsRepository;
    private usageRepository;
    private ordersRepository;
    constructor(couponsRepository: Repository<Coupon>, usageRepository: Repository<CouponUsage>, ordersRepository: Repository<Order>);
    create(createCouponDto: CreateCouponDto): Promise<Coupon>;
    findAll(): Promise<Coupon[]>;
    findActive(): Promise<Coupon[]>;
    findOne(id: string): Promise<Coupon>;
    findByCode(code: string): Promise<Coupon>;
    validateCoupon(validateDto: ValidateCouponDto, userId: string): Promise<{
        valid: boolean;
        discount: number;
        message?: string;
    }>;
    recordUsage(couponId: string, userId: string, orderId: string, discountAmount: number): Promise<void>;
    update(id: string, updateCouponDto: UpdateCouponDto): Promise<Coupon>;
    remove(id: string): Promise<void>;
    getCouponStats(id: string): Promise<any>;
}
