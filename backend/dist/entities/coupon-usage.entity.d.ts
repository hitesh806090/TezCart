import { User } from './user.entity';
import { Coupon } from './coupon.entity';
import { Order } from './order.entity';
export declare class CouponUsage {
    id: string;
    user: User;
    userId: string;
    coupon: Coupon;
    couponId: string;
    order: Order;
    orderId: string;
    discountAmount: number;
    usedAt: Date;
}
