"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const coupon_entity_1 = require("../entities/coupon.entity");
const coupon_usage_entity_1 = require("../entities/coupon-usage.entity");
const order_entity_1 = require("../entities/order.entity");
let CouponsService = class CouponsService {
    couponsRepository;
    usageRepository;
    ordersRepository;
    constructor(couponsRepository, usageRepository, ordersRepository) {
        this.couponsRepository = couponsRepository;
        this.usageRepository = usageRepository;
        this.ordersRepository = ordersRepository;
    }
    async create(createCouponDto) {
        const existing = await this.couponsRepository.findOne({
            where: { code: createCouponDto.code.toUpperCase() },
        });
        if (existing) {
            throw new common_1.BadRequestException('Coupon code already exists');
        }
        const coupon = this.couponsRepository.create({
            ...createCouponDto,
            code: createCouponDto.code.toUpperCase(),
            validFrom: new Date(createCouponDto.validFrom),
            validUntil: new Date(createCouponDto.validUntil),
        });
        return this.couponsRepository.save(coupon);
    }
    async findAll() {
        return this.couponsRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findActive() {
        const now = new Date();
        return this.couponsRepository
            .createQueryBuilder('coupon')
            .where('coupon.status = :status', { status: coupon_entity_1.CouponStatus.ACTIVE })
            .andWhere('coupon.validFrom <= :now', { now })
            .andWhere('coupon.validUntil >= :now', { now })
            .andWhere('(coupon.maxTotalUses IS NULL OR coupon.currentUses < coupon.maxTotalUses)')
            .getMany();
    }
    async findOne(id) {
        const coupon = await this.couponsRepository.findOne({ where: { id } });
        if (!coupon) {
            throw new common_1.NotFoundException('Coupon not found');
        }
        return coupon;
    }
    async findByCode(code) {
        const coupon = await this.couponsRepository.findOne({
            where: { code: code.toUpperCase() },
        });
        if (!coupon) {
            throw new common_1.NotFoundException('Coupon not found');
        }
        return coupon;
    }
    async validateCoupon(validateDto, userId) {
        try {
            const coupon = await this.findByCode(validateDto.code);
            const now = new Date();
            if (coupon.status !== coupon_entity_1.CouponStatus.ACTIVE) {
                return { valid: false, discount: 0, message: 'Coupon is not active' };
            }
            if (now < coupon.validFrom) {
                return { valid: false, discount: 0, message: 'Coupon is not yet valid' };
            }
            if (now > coupon.validUntil) {
                return { valid: false, discount: 0, message: 'Coupon has expired' };
            }
            if (coupon.maxTotalUses && coupon.currentUses >= coupon.maxTotalUses) {
                return { valid: false, discount: 0, message: 'Coupon usage limit reached' };
            }
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
            if (validateDto.orderAmount && validateDto.orderAmount < coupon.minOrderAmount) {
                return {
                    valid: false,
                    discount: 0,
                    message: `Minimum order amount of $${coupon.minOrderAmount} required`,
                };
            }
            let discount = 0;
            if (coupon.discountType === coupon_entity_1.DiscountType.PERCENTAGE) {
                if (validateDto.orderAmount) {
                    discount = (validateDto.orderAmount * coupon.discountValue) / 100;
                    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
                        discount = coupon.maxDiscountAmount;
                    }
                }
            }
            else if (coupon.discountType === coupon_entity_1.DiscountType.FIXED_AMOUNT) {
                discount = coupon.discountValue;
            }
            else if (coupon.discountType === coupon_entity_1.DiscountType.FREE_SHIPPING) {
                discount = 0;
            }
            return {
                valid: true,
                discount: Math.round(discount * 100) / 100,
                message: 'Coupon is valid',
            };
        }
        catch (error) {
            return { valid: false, discount: 0, message: 'Invalid coupon code' };
        }
    }
    async recordUsage(couponId, userId, orderId, discountAmount) {
        const usage = this.usageRepository.create({
            couponId,
            userId,
            orderId,
            discountAmount,
        });
        await this.usageRepository.save(usage);
        await this.couponsRepository.increment({ id: couponId }, 'currentUses', 1);
    }
    async update(id, updateCouponDto) {
        const coupon = await this.findOne(id);
        if (updateCouponDto.validUntil) {
            coupon.validUntil = new Date(updateCouponDto.validUntil);
        }
        Object.assign(coupon, updateCouponDto);
        return this.couponsRepository.save(coupon);
    }
    async remove(id) {
        const coupon = await this.findOne(id);
        await this.couponsRepository.remove(coupon);
    }
    async getCouponStats(id) {
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
};
exports.CouponsService = CouponsService;
exports.CouponsService = CouponsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(coupon_entity_1.Coupon)),
    __param(1, (0, typeorm_1.InjectRepository)(coupon_usage_entity_1.CouponUsage)),
    __param(2, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CouponsService);
//# sourceMappingURL=coupons.service.js.map