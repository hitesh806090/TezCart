import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from "./app.service";
import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { TenantModule } from './common/tenant.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from 'db';
import { User } from 'db';
import { Role } from 'db';
import { Permission } from 'db';
import { AuditLog } from 'db';
import { UserSession } from 'db';
import { Address } from 'db';
import { Category } from 'db';
import { Product } from 'db';
import { HomePageContent } from 'db';
import { Cart } from 'db';
import { CartItem } from 'db';
import { ShippingMethod } from 'db';
import { Order } from 'db';
import { OrderItem } from 'db';
import { Payment } from 'db';
import { SellerProfile } from 'db';
import { SellerKycDocument } from 'db';
import { Payout } from 'db';
import { DeliveryPartnerProfile } from 'db';
import { DeliveryPartnerKycDocument } from 'db';
import { DeliveryTask } from 'db';
import { ReturnReason } from 'db';
import { ReturnRequest } from 'db';
import { ReturnItem } from 'db';
import { ReturnPickupTask } from 'db';
import { Wallet } from 'db';
import { WalletTransaction } from "db";
import { Coupon } from 'db';
import { Campaign } from 'db';
import { CampaignProduct } from 'db';
import { AutomaticDiscount } from 'db';
import { LoyaltyPoint } from 'db';
import { LoyaltyTransaction } from "db";
import { Badge } from 'db';
import { UserBadge } from 'db';
import { Mission } from 'db';
import { UserMission } from 'db';
import { Referral } from 'db';
import { NotificationTemplate } from 'db';
import { Notification } from 'db';
import { ProductAlert } from 'db';
import { ProductReview } from 'db';
import { SellerRating } from 'db';
import { ProductQuestion } from 'db';
import { ProductAnswer } from 'db';
import { AnalyticsEvent } from 'db';
import { DailySalesMetric } from 'db'; // Import DailySalesMetric
import { ProductMetric } from 'db'; // Import ProductMetric
import { ConfigModule } from '@nestjs/config';
import { TenantConfigModule } from './tenant-config/tenant-config.module';
import { AuditModule } from './audit/audit.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditInterceptor } from './audit/interceptors/audit.interceptor';
import { AuthModule } from './auth/auth.module';
import { UserModule } from "./user/user.module";
import { SessionModule } from './session/session.module';
import { AddressModule } from './address/address.module';
import { CategoryModule } from "./category/category.module";
import { ProductModule } from './product/product.module';
import { InventoryModule } from './inventory/inventory.module';
import { SearchModule } from './search/search.module';
import { HomePageModule } from './homepage/homepage.module';
import { CartModule } from './cart/cart.module';
import { CheckoutModule } from './checkout/checkout.module';
import { OrderModule } from "./order/order.module";
import { PaymentModule } from './payment/payment.module';
import { SellerModule } from './seller/seller.module';
import { SellerDashboardModule } from './seller-dashboard/seller-dashboard.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { SettlementModule } from './settlement/settlement.module';
import { DeliveryPartnerModule } from './delivery-partner/delivery-partner.module';
import { AssignmentModule } from "./assignment/assignment.module";
import { RoutingModule } from './routing/routing.module';
import { TrackingModule } from './tracking/tracking.module';
import { OtpModule } from './otp/otp.module';
import { ReturnModule } from './return/return.module';
import { WalletModule } from './wallet/wallet.module';
import { DiscountModule } from './discount/discount.module';
import { CampaignModule } from './campaign/campaign.module';
import { LoyaltyModule } from './loyalty/loyalty.module';
import { ReviewModule } from './review/review.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ScheduleModule } from '@nestjs/schedule'; // Import ScheduleModule


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(), // Initialize ScheduleModule
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'tezcart_db',
      entities: [Tenant, User, Role, Permission, AuditLog, UserSession, Address, Category, Product, HomePageContent, Cart, CartItem, ShippingMethod, Order, OrderItem, Payment, SellerProfile, SellerKycDocument, Payout, DeliveryPartnerProfile, DeliveryPartnerKycDocument, DeliveryTask, ReturnReason, ReturnRequest, ReturnItem, ReturnPickupTask, Wallet, WalletTransaction, Coupon, Campaign, CampaignProduct, AutomaticDiscount, LoyaltyPoint, LoyaltyTransaction, Badge, UserBadge, Mission, UserMission, Referral, NotificationTemplate, Notification, ProductAlert, ProductReview, SellerRating, ProductQuestion, ProductAnswer, AnalyticsEvent, DailySalesMetric, ProductMetric], // Add Metric entities
      synchronize: true,
      logging: ['query', 'error'],
    }),
    TenantModule,
    TenantConfigModule,
    AuditModule,
    AuthModule,
    UserModule,
    SessionModule,
    AddressModule,
    CategoryModule,
    ProductModule,
    InventoryModule,
    SearchModule,
    HomePageModule,
    CartModule,
    CheckoutModule,
    OrderModule,
    PaymentModule,
    SellerModule,
    SellerDashboardModule,
    FileUploadModule,
    SettlementModule,
    DeliveryPartnerModule,
    AssignmentModule,
    RoutingModule,
    TrackingModule,
    OtpModule,
    ReturnModule,
    WalletModule,
    DiscountModule,
    CampaignModule,
    LoyaltyModule,
    ReviewModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
