import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ProductReview } from 'db';
import { SellerRating } from 'db';
import { ProductQuestion } from 'db'; // Import ProductQuestion
import { ProductAnswer } from 'db'; // Import ProductAnswer
import { TenantModule } from '../common/tenant.module';
import { OrderModule } from '../order/order.module';
import { ProductModule } from '../product/product.module';
import { SellerModule } from '../seller/seller.module';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { UserModule } from '../user/user.module'; // Import UserModule for user roles

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductReview, SellerRating, ProductQuestion, ProductAnswer]), // Register Q&A entities
    TenantModule,
    OrderModule,
    ProductModule,
    SellerModule,
    FileUploadModule,
    UserModule, // For getting user roles
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
