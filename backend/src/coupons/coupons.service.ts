import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon, DiscountType, CouponStatus } from '../entities/coupon.entity';
import { CouponUsage } from '../entities/coupon-usage.entity';
import { Order } from '../entities/order.entity';
import { CreateCouponDto, UpdateCouponDto, ValidateCouponDto } from './dto/coupon.dto';

@Injectable()
export class CouponsService {
    constructor(
        @InjectRepository(Coupon)
        private couponsRepository: Repository<Coupon>,
        @InjectRepository(CouponUsage)
        private usageRepository: Repository<CouponUsage>,
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
    ) { }

    async create(createCouponDto: CreateCouponDto): Promise<Coupon> {
        // Check if code already exists
        const existing = await this.couponsRepository.findOne({
            where: { code: createCouponDto.code.toUpperCase() },
        });

        if (existing) {
            throw new BadRequestException('Coupon code already exists');
        }

        const coupon = this.couponsRepository.create({
            ...createCouponDto,
            code: createCouponDto.code.toUpperCase(),
            validFrom: new Date(createCouponDto.validFrom),
            validUntil: new Date(createCouponDto.validUntil),
        });

        return this.couponsRepository.save(coupon);
    }

    async findAll(): Promise<Coupon[]> {
        return this.couponsRepository.find({
            order: { createdAt: 'DESC' },
        });
    }

    async findActive(): Promise<Coupon[]> {
        const now = new Date();

        return this.couponsRepository
            .createQueryBuilder('coupon')
            .where('coupon.status = :status', { status: CouponStatus.ACTIVE })
            .andWhere('coupon.validFrom <= :now', { now })
            .andWhere('coupon.validUntil >= :now', { now })
            .andWhere('(coupon.maxTotalUses IS NULL OR coupon.currentUses < coupon.maxTotalUses)')
            .getMany();
    }

    async findOne(id: string): Promise<Coupon> {
        const coupon = await this.couponsRepository.findOne({ where: { id } });

        if (!coupon) {
            throw new NotFoundException('Coupon not found');
        }

        return coupon;
    }

    async findByCode(code: string): Promise<Coupon> {
        const coupon = await this.couponsRepository.findOne({
            where: { code: code.toUpperCase() },
        });

        if (!coupon) {
            throw new NotFoundException('Coupon not found');
        }

        return coupon;
    }

    async validateCoupon(
        validateDto: ValidateCouponDto,
        userId: string,
    ): Promise<{ valid: boolean; discount: number; message?: string }> {
        try {
            const coupon = await this.findByCode(validateDto.code);
            const now = new Date();

            // Check if coupon is active
            if (coupon.status !== CouponStatus.ACTIVE) {
                return { valid: false, discount: 0, message: 'Coupon is not active' };
            }

            // Check validity dates
            if (now < coupon.validFrom) {
                return { valid: false, discount: 0, message: 'Coupon is not yet valid' };
            }

            if (now > coupon.validUntil) {
                return { valid: false, discount: 0, message: 'Coupon has expired' };
            }

            // Check total uses
            if (coupon.maxTotalUses && coupon.currentUses >= coupon.maxTotalUses) {
                return { valid: false, discount: 0, message: 'Coupon usage limit reached' };
            }

            // Check per-user uses
            const userUsageCount = await this.usageRepository.count({
                where: { userId, couponId: coupon.id },
            });

            if (userUsageCount >= coupon.maxUsesPerUser) {
                return {
                    valid: false,
                    discount: 0,
                    message: 'You have already used this coupon',
                };
            }

            // Check first order only
            if (coupon.isFirstOrderOnly) {
                const orderCount = await this.ordersRepository.count({
                    where: { userId },
                });

                if (orderCount > 0) {
                    return {
                        valid: false,
                        discount: 0,
                        message: 'This coupon is only valid for first orders',
                    };
                }
            }

            // Check minimum order amount
            if (validateDto.orderAmount && validateDto.orderAmount < coupon.minOrderAmount) {
                return {
                    valid: false,
                    discount: 0,
                    message: `Minimum order amount of $${coupon.minOrderAmount} required`,
                };
            }

            // Calculate discount
            let discount = 0;

            if (coupon.discountType === DiscountType.PERCENTAGE) {
                if (validateDto.orderAmount) {
                    discount = (validateDto.orderAmount * coupon.discountValue) / 100;

                    // Apply max discount cap
                    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
                        discount = coupon.maxDiscountAmount;
                    }
                }
            } else if (coupon.discountType === DiscountType.FIXED_AMOUNT) {
                discount = coupon.discountValue;
            } else if (coupon.discountType === DiscountType.FREE_SHIPPING) {
                // This will be handled differently in order calculation
                discount = 0;
            }

            return {
                valid: true,
                discount: Math.round(discount * 100) / 100,
                message: 'Coupon is valid',
            };
        } catch (error) {
            return { valid: false, discount: 0, message: 'Invalid coupon code' };
        }
    }

    async recordUsage(
        couponId: string,
        userId: string,
        orderId: string,
        discountAmount: number,
    ): Promise<void> {
        // Create usage record
        const usage = this.usageRepository.create({
            couponId,
            userId,
            orderId,
            discountAmount,
        });

        await this.usageRepository.save(usage);

        // Increment usage count
        await this.couponsRepository.increment({ id: couponId }, 'currentUses', 1);
    }

    async update(id: string, updateCouponDto: UpdateCouponDto): Promise<Coupon> {
        const coupon = await this.findOne(id);

        if (updateCouponDto.validUntil) {
            coupon.validUntil = new Date(updateCouponDto.validUntil);
        }

        Object.assign(coupon, updateCouponDto);

        return this.couponsRepository.save(coupon);
    }

    async remove(id: string): Promise<void> {
        const coupon = await this.findOne(id);
        await this.couponsRepository.remove(coupon);
    }

    async getCouponStats(id: string): Promise<any> {
        const coupon = await this.findOne(id);

        const usages = await this.usageRepository.find({
            where: { couponId: id },
            relations: ['user', 'order'],
        });

        const totalDiscount = usages.reduce((sum, u) => sum + Number(u.discountAmount), 0);

        return {
            coupon,
            usages: coupon.currentUses,
            uniqueUsers: new Set(usages.map(u => u.userId)).size,
            totalDiscountGiven: totalDiscount,
            recentUsages: usages.slice(0, 10),
        };
    }
}
