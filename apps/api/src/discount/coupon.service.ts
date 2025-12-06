import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from 'db';
import { TenantProvider } from '..//common/tenant.module';
import { v4 as uuidv4 } from 'uuid'; // For generating coupon codes

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
    private readonly tenantProvider: TenantProvider,
  ) {}

  private get tenantId(): string {
    const tenantId = this.tenantProvider.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing.');
    }
    return tenantId;
  }

  async generateUniqueCouponCode(prefix: string = 'COUPON'): Promise<string> {
    let code: string;
    let isUnique = false;
    do {
      code = `${prefix}-${uuidv4().substring(0, 8).toUpperCase()}`;
      const existingCoupon = await this.couponRepository.findOne({ where: { code, tenantId: this.tenantId } });
      if (!existingCoupon) {
        isUnique = true;
      }
    } while (!isUnique);
    return code;
  }

  async createCoupon(couponData: Partial<Coupon>, userId: string): Promise<Coupon> {
    // Validate dates
    if (couponData.validFrom && couponData.validUntil && couponData.validFrom >= couponData.validUntil) {
      throw new BadRequestException('ValidFrom date must be before ValidUntil date.');
    }

    // Generate code if not provided
    if (!couponData.code) {
        couponData.code = await this.generateUniqueCouponCode();
    } else {
        const existingCoupon = await this.couponRepository.findOne({ where: { code: couponData.code, tenantId: this.tenantId } });
        if (existingCoupon) {
            throw new ConflictException(`Coupon code '${couponData.code}' already exists.`);
        }
    }
    
    const newCoupon = this.couponRepository.create({
      ...couponData,
      tenantId: this.tenantId,
    });
    return this.couponRepository.save(newCoupon);
  }

  async findCouponByCode(code: string): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({
      where: { code, tenantId: this.tenantId, isActive: true },
    });
    if (!coupon) {
      throw new NotFoundException(`Coupon with code ${code} not found or inactive.`);
    }
    // Basic validation: check dates
    const now = new Date();
    if (coupon.validFrom > now || coupon.validUntil < now) {
      throw new BadRequestException('Coupon is not currently active.');
    }
    return coupon;
  }

  async getCouponsForSeller(sellerId: string): Promise<Coupon[]> {
    return this.couponRepository.find({
      where: { tenantId: this.tenantId, sellerId, isActive: true },
    });
  }

  async getPlatformCoupons(): Promise<Coupon[]> {
    return this.couponRepository.find({
      where: { tenantId: this.tenantId, sellerId: IsNull(), isActive: true },
    });
  }

  async updateCoupon(id: string, updateData: Partial<Coupon>): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({ where: { id, tenantId: this.tenantId } });
    if (!coupon) {
      throw new NotFoundException(`Coupon with ID ${id} not found.`);
    }

    if (updateData.validFrom && updateData.validUntil && updateData.validFrom >= updateData.validUntil) {
      throw new BadRequestException('ValidFrom date must be before ValidUntil date.');
    }
    
    this.couponRepository.merge(coupon, updateData);
    return this.couponRepository.save(coupon);
  }

  async deleteCoupon(id: string): Promise<void> {
    const result = await this.couponRepository.delete({ id, tenantId: this.tenantId });
    if (result.affected === 0) {
      throw new NotFoundException(`Coupon with ID ${id} not found.`);
    }
  }

  // TODO: Add methods for applying coupon logic during checkout (more complex)
  // TODO: Add methods for tracking coupon usage per user/globally
}
