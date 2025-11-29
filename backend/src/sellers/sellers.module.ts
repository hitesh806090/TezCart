import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellersController } from './sellers.controller';
import { SellersService } from './sellers.service';
import { Seller } from './entities/seller.entity';
import { AuthModule } from '../auth/auth.module';
import { AdminSellersController } from './admin-sellers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Seller]), AuthModule],
  controllers: [SellersController, AdminSellersController],
  providers: [SellersService],
  exports: [SellersService],
})
export class SellersModule {}
