import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart } from 'db';
import { CartItem } from 'db';
import { TenantModule } from '../common/tenant.module';
import { ProductModule } from '../product/product.module';
import { InventoryModule } from '../inventory/inventory.module';
import { UserModule } from '../user/user.module';
import { DiscountModule } from '../discount/discount.module'; // Import DiscountModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    TenantModule,
    ProductModule,
    InventoryModule,
    UserModule,
    DiscountModule, // Add DiscountModule
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
