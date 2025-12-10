import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellersService } from './sellers.service';
import { SellersController } from './sellers.controller';
import { Seller } from '../entities/seller.entity';
import { Product } from '../entities/product.entity';
import { Order } from '../entities/order.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Seller, Product, Order])],
    controllers: [SellersController],
    providers: [SellersService],
    exports: [SellersService],
})
export class SellersModule { }
