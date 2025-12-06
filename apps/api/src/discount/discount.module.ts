import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { AutomaticDiscountService } from './automatic-discount.service'; // Import AutomaticDiscountService
import { AutomaticDiscountController } from './automatic-discount.controller'; // Import AutomaticDiscountController
import { Coupon } from 'db';
import { AutomaticDiscount } from 'db'; // Import AutomaticDiscount entity
import { TenantModule } from '..//common/tenant.module';
import { ProductModule } from '../product/product.module'; // Needed for AutomaticDiscountService
import { CategoryModule } from '../category/category.module'; // Needed for AutomaticDiscountService


@Module({
  imports: [
    TypeOrmModule.forFeature([Coupon, AutomaticDiscount]), // Register AutomaticDiscount entity
    TenantModule,
    ProductModule, // To validate product conditions in AutomaticDiscountService
    CategoryModule, // To validate category conditions in AutomaticDiscountService
  ],
  controllers: [CouponController, AutomaticDiscountController], // Add AutomaticDiscountController
  providers: [CouponService, AutomaticDiscountService], // Add AutomaticDiscountService
  exports: [CouponService, AutomaticDiscountService], // Export both services
})
export class DiscountModule {}
