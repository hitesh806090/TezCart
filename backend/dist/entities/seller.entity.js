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
exports.Seller = exports.SellerTier = exports.SellerStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
var SellerStatus;
(function (SellerStatus) {
    SellerStatus["PENDING"] = "pending";
    SellerStatus["APPROVED"] = "approved";
    SellerStatus["SUSPENDED"] = "suspended";
    SellerStatus["REJECTED"] = "rejected";
})(SellerStatus || (exports.SellerStatus = SellerStatus = {}));
var SellerTier;
(function (SellerTier) {
    SellerTier["BRONZE"] = "bronze";
    SellerTier["SILVER"] = "silver";
    SellerTier["GOLD"] = "gold";
    SellerTier["PLATINUM"] = "platinum";
})(SellerTier || (exports.SellerTier = SellerTier = {}));
let Seller = class Seller {
    id;
    user;
    userId;
    shopName;
    shopSlug;
    description;
    logo;
    banner;
    businessName;
    businessAddress;
    businessPhone;
    businessEmail;
    taxId;
    gstNumber;
    bankDetails;
    rating;
    totalReviews;
    totalProducts;
    totalSales;
    totalRevenue;
    tier;
    status;
    isActive;
    commissionRate;
    rejectionReason;
    approvedAt;
    createdAt;
    updatedAt;
};
exports.Seller = Seller;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Seller.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Seller.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Seller.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Seller.prototype, "shopName", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Seller.prototype, "shopSlug", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Seller.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Seller.prototype, "logo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Seller.prototype, "banner", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Seller.prototype, "businessName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Seller.prototype, "businessAddress", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Seller.prototype, "businessPhone", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Seller.prototype, "businessEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Seller.prototype, "taxId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Seller.prototype, "gstNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Seller.prototype, "bankDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 3, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Seller.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Seller.prototype, "totalReviews", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Seller.prototype, "totalProducts", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Seller.prototype, "totalSales", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Seller.prototype, "totalRevenue", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SellerTier,
        default: SellerTier.BRONZE,
    }),
    __metadata("design:type", String)
], Seller.prototype, "tier", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SellerStatus,
        default: SellerStatus.PENDING,
    }),
    __metadata("design:type", String)
], Seller.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Seller.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 10 }),
    __metadata("design:type", Number)
], Seller.prototype, "commissionRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Seller.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Seller.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Seller.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Seller.prototype, "updatedAt", void 0);
exports.Seller = Seller = __decorate([
    (0, typeorm_1.Entity)('sellers'),
    (0, typeorm_1.Index)(['userId'], { unique: true })
], Seller);
//# sourceMappingURL=seller.entity.js.map