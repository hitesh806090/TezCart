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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponUsage = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const coupon_entity_1 = require("./coupon.entity");
const order_entity_1 = require("./order.entity");
let CouponUsage = class CouponUsage {
    id;
    user;
    userId;
    coupon;
    couponId;
    order;
    orderId;
    discountAmount;
    usedAt;
};
exports.CouponUsage = CouponUsage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CouponUsage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], CouponUsage.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CouponUsage.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => coupon_entity_1.Coupon, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'couponId' }),
    __metadata("design:type", coupon_entity_1.Coupon)
], CouponUsage.prototype, "coupon", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CouponUsage.prototype, "couponId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_entity_1.Order, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'orderId' }),
    __metadata("design:type", order_entity_1.Order)
], CouponUsage.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CouponUsage.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], CouponUsage.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CouponUsage.prototype, "usedAt", void 0);
exports.CouponUsage = CouponUsage = __decorate([
    (0, typeorm_1.Entity)('coupon_usage'),
    (0, typeorm_1.Index)(['userId', 'couponId'])
], CouponUsage);
//# sourceMappingURL=coupon-usage.entity.js.map