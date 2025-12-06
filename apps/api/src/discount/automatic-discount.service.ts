import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AutomaticDiscount } from 'db';
import { TenantProvider } from '..//common/tenant.module';
import { ProductService } from '../product/product.service'; // For validating product conditions
import { CategoryService } from '../category/category.service'; // For validating category conditions

@Injectable()
export class AutomaticDiscountService {
  constructor(
    @InjectRepository(AutomaticDiscount)
    private readonly automaticDiscountRepository: Repository<AutomaticDiscount>,
    private readonly tenantProvider: TenantProvider,
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
  ) {}

  private get tenantId(): string {
    const tenantId = this.tenantProvider.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing.');
    }
    return tenantId;
  }

  async createAutomaticDiscount(discountData: Partial<AutomaticDiscount>): Promise<AutomaticDiscount> {
    if (discountData.validFrom && discountData.validUntil && discountData.validFrom >= discountData.validUntil) {
      throw new BadRequestException('ValidFrom date must be before ValidUntil date.');
    }
    const existingDiscount = await this.automaticDiscountRepository.findOne({ where: { name: discountData.name, tenantId: this.tenantId } });
    if (existingDiscount) {
      throw new ConflictException(`Automatic discount with name '${discountData.name}' already exists.`);
    }
    const newDiscount = this.automaticDiscountRepository.create({
      ...discountData,
      tenantId: this.tenantId,
    });
    return this.automaticDiscountRepository.save(newDiscount);
  }

  async findAllActiveDiscounts(): Promise<AutomaticDiscount[]> {
    const now = new Date();
    return this.automaticDiscountRepository.find({
      where: {
        tenantId: this.tenantId,
        isActive: true,
        // validFrom: LessThanOrEqual(now), // These would be active checks
        // validUntil: MoreThanOrEqual(now),
      },
      order: { validFrom: 'ASC' },
    });
  }

  async findDiscountById(id: string): Promise<AutomaticDiscount> {
    const discount = await this.automaticDiscountRepository.findOne({ where: { id, tenantId: this.tenantId } });
    if (!discount) {
      throw new NotFoundException(`Automatic discount with ID ${id} not found.`);
    }
    return discount;
  }

  async updateAutomaticDiscount(id: string, updateData: Partial<AutomaticDiscount>): Promise<AutomaticDiscount> {
    const discount = await this.findDiscountById(id);
    if (updateData.validFrom && updateData.validUntil && updateData.validFrom >= updateData.validUntil) {
      throw new BadRequestException('ValidFrom date must be before ValidUntil date.');
    }
    this.automaticDiscountRepository.merge(discount, updateData);
    return this.automaticDiscountRepository.save(discount);
  }

  async deleteAutomaticDiscount(id: string): Promise<void> {
    const result = await this.automaticDiscountRepository.delete({ id, tenantId: this.tenantId });
    if (result.affected === 0) {
      throw new NotFoundException(`Automatic discount with ID ${id} not found.`);
    }
  }

  // --- Logic for applying discounts to a cart ---
  // This is a complex logic, for MVP, a placeholder
  async applyAutomaticDiscountsToCart(cartDetails: any): Promise<any> {
    const activeDiscounts = await this.findAllActiveDiscounts();
    let totalDiscountAmount = 0;
    const appliedDiscounts: any[] = [];

    // This is a very simplified application logic.
    // Real implementation would involve iterating through cart items, checking product/category conditions,
    // handling "Buy X Get Y", stacking rules, etc.
    for (const discount of activeDiscounts) {
      if (!discount.isActive || discount.validFrom > new Date() || discount.validUntil < new Date()) {
        continue;
      }

      let discountApplied = 0;
      let eligibleForDiscount = false;

      // Example: Min cart value condition
      if (discount.conditions && (discount.conditions as any).minCartValue && cartDetails.cartTotal >= (discount.conditions as any).minCartValue) {
        eligibleForDiscount = true;
      }
      
      // For MVP, assume a simple cart-level percentage or fixed amount
      if (eligibleForDiscount) {
        if (discount.type === 'percentage_off_cart') {
          discountApplied = (cartDetails.cartTotal * discount.value) / 100;
          if (discount.maxDiscountAmount && discountApplied > discount.maxDiscountAmount) {
            discountApplied = discount.maxDiscountAmount;
          }
        } else if (discount.type === 'fixed_amount_off_cart') {
          discountApplied = discount.value;
        }
        
        totalDiscountAmount += discountApplied;
        appliedDiscounts.push({
            discountId: discount.id,
            name: discount.name,
            amount: discountApplied,
            type: discount.type
        });
        // For "Buy X Get Y", you'd modify cart items, not just total.
      }
    }

    // Return cart details with applied discounts
    return {
      ...cartDetails,
      totalDiscountAmount,
      appliedDiscounts,
      finalCartTotal: cartDetails.cartTotal - totalDiscountAmount,
    };
  }
}
