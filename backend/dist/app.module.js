"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const products_module_1 = require("./products/products.module");
const categories_module_1 = require("./categories/categories.module");
const reviews_module_1 = require("./reviews/reviews.module");
const wishlists_module_1 = require("./wishlists/wishlists.module");
const cart_module_1 = require("./cart/cart.module");
const orders_module_1 = require("./orders/orders.module");
const addresses_module_1 = require("./addresses/addresses.module");
const coupons_module_1 = require("./coupons/coupons.module");
const notifications_module_1 = require("./notifications/notifications.module");
const product_qa_module_1 = require("./product-qa/product-qa.module");
const search_module_1 = require("./search/search.module");
const sellers_module_1 = require("./sellers/sellers.module");
const analytics_module_1 = require("./analytics/analytics.module");
const payments_module_1 = require("./payments/payments.module");
const data_source_1 = require("./data-source");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    ...data_source_1.dataSourceOptions,
                    url: configService.get('DATABASE_URL'),
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            products_module_1.ProductsModule,
            categories_module_1.CategoriesModule,
            reviews_module_1.ReviewsModule,
            wishlists_module_1.WishlistsModule,
            cart_module_1.CartModule,
            orders_module_1.OrdersModule,
            addresses_module_1.AddressesModule,
            coupons_module_1.CouponsModule,
            notifications_module_1.NotificationsModule,
            product_qa_module_1.ProductQaModule,
            search_module_1.SearchModule,
            sellers_module_1.SellersModule,
            analytics_module_1.AnalyticsModule,
            payments_module_1.PaymentsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map