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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sellers_service_1 = require("./sellers.service");
const seller_dto_1 = require("./dto/seller.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const seller_entity_1 = require("../entities/seller.entity");
let SellersController = class SellersController {
    sellersService;
    constructor(sellersService) {
        this.sellersService = sellersService;
    }
    create(createSellerDto, req) {
        return this.sellersService.create(createSellerDto, req.user.userId);
    }
    findAll(status) {
        return this.sellersService.findAll(status);
    }
    getMyShop(req) {
        return this.sellersService.getMyShop(req.user.userId);
    }
    findBySlug(slug) {
        return this.sellersService.findBySlug(slug);
    }
    findOne(id) {
        return this.sellersService.findOne(id);
    }
    getStats(id) {
        return this.sellersService.getStats(id);
    }
    update(id, updateSellerDto, req) {
        return this.sellersService.update(id, updateSellerDto, req.user.userId);
    }
    approve(id, approveDto) {
        return this.sellersService.approve(id, approveDto);
    }
    reject(id, rejectDto) {
        return this.sellersService.reject(id, rejectDto);
    }
    async suspend(id, reason) {
        return this.sellersService.suspend(id, reason);
    }
    activate(id) {
        return this.sellersService.activate(id);
    }
};
exports.SellersController = SellersController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Register as a seller' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Seller account created (pending approval)' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'User already has a seller account' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [seller_dto_1.CreateSellerDto, Object]),
    __metadata("design:returntype", void 0)
], SellersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all sellers (Admin only)' }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: seller_entity_1.SellerStatus, required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns all sellers' }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SellersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-shop'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get my seller shop' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns seller shop details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No seller account found' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SellersController.prototype, "getMyShop", null);
__decorate([
    (0, common_1.Get)('slug/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get seller by shop slug' }),
    (0, swagger_1.ApiParam)({ name: 'slug', description: 'Shop slug' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns seller details' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SellersController.prototype, "findBySlug", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get seller by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Seller ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns seller details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SellersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get seller statistics' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Seller ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns seller stats' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SellersController.prototype, "getStats", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update seller shop' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Seller ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Seller updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, seller_dto_1.UpdateSellerDto, Object]),
    __metadata("design:returntype", void 0)
], SellersController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Approve seller (Admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Seller ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Seller approved' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, seller_dto_1.ApproveSellerDto]),
    __metadata("design:returntype", void 0)
], SellersController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Reject seller (Admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Seller ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Seller rejected' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, seller_dto_1.RejectSellerDto]),
    __metadata("design:returntype", void 0)
], SellersController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)(':id/suspend'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Suspend seller (Admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Seller ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Seller suspended' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SellersController.prototype, "suspend", null);
__decorate([
    (0, common_1.Post)(':id/activate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Activate seller (Admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Seller ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Seller activated' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SellersController.prototype, "activate", null);
exports.SellersController = SellersController = __decorate([
    (0, swagger_1.ApiTags)('sellers'),
    (0, common_1.Controller)('sellers'),
    __metadata("design:paramtypes", [sellers_service_1.SellersService])
], SellersController);
//# sourceMappingURL=sellers.controller.js.map