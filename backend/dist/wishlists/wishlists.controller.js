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
exports.WishlistsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const wishlists_service_1 = require("./wishlists.service");
const wishlist_dto_1 = require("./dto/wishlist.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let WishlistsController = class WishlistsController {
    wishlistsService;
    constructor(wishlistsService) {
        this.wishlistsService = wishlistsService;
    }
    addToWishlist(productId, addToWishlistDto, req) {
        return this.wishlistsService.addToWishlist(productId, addToWishlistDto, req.user.userId);
    }
    getMyWishlist(req, page, limit) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 20;
        return this.wishlistsService.getMyWishlist(req.user.userId, pageNum, limitNum);
    }
    getWishlistCount(req) {
        return this.wishlistsService.getWishlistCount(req.user.userId);
    }
    getWishlistWithPriceAlerts(req) {
        return this.wishlistsService.getWishlistWithPriceAlerts(req.user.userId);
    }
    getWishlistBackInStock(req) {
        return this.wishlistsService.getWishlistBackInStock(req.user.userId);
    }
    async checkInWishlist(productId, req) {
        const isInWishlist = await this.wishlistsService.isInWishlist(productId, req.user.userId);
        return { isInWishlist };
    }
    findOne(id, req) {
        return this.wishlistsService.findOne(id, req.user.userId);
    }
    update(id, updateWishlistDto, req) {
        return this.wishlistsService.update(id, updateWishlistDto, req.user.userId);
    }
    remove(id, req) {
        return this.wishlistsService.remove(id, req.user.userId);
    }
    removeByProduct(productId, req) {
        return this.wishlistsService.removeByProduct(productId, req.user.userId);
    }
};
exports.WishlistsController = WishlistsController;
__decorate([
    (0, common_1.Post)('products/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Add product to wishlist' }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'Product ID' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Product added to wishlist' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Product already in wishlist' }),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, wishlist_dto_1.AddToWishlistDto, Object]),
    __metadata("design:returntype", void 0)
], WishlistsController.prototype, "addToWishlist", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get my wishlist' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns user wishlist' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], WishlistsController.prototype, "getMyWishlist", null);
__decorate([
    (0, common_1.Get)('count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get wishlist items count' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns wishlist count' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WishlistsController.prototype, "getWishlistCount", null);
__decorate([
    (0, common_1.Get)('price-alerts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get wishlist items with price drops' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns items where price dropped to desired level' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WishlistsController.prototype, "getWishlistWithPriceAlerts", null);
__decorate([
    (0, common_1.Get)('back-in-stock'),
    (0, swagger_1.ApiOperation)({ summary: 'Get wishlist items that are back in stock' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns items that are now available' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WishlistsController.prototype, "getWishlistBackInStock", null);
__decorate([
    (0, common_1.Get)('products/:productId/check'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if product is in wishlist' }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'Product ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns boolean' }),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WishlistsController.prototype, "checkInWishlist", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a wishlist item by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the wishlist item' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Wishlist item not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WishlistsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update wishlist item settings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Wishlist item updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, wishlist_dto_1.UpdateWishlistDto, Object]),
    __metadata("design:returntype", void 0)
], WishlistsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove item from wishlist' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item removed from wishlist' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WishlistsController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)('products/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove product from wishlist by product ID' }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'Product ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product removed from wishlist' }),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WishlistsController.prototype, "removeByProduct", null);
exports.WishlistsController = WishlistsController = __decorate([
    (0, swagger_1.ApiTags)('wishlists'),
    (0, common_1.Controller)('wishlists'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [wishlists_service_1.WishlistsService])
], WishlistsController);
//# sourceMappingURL=wishlists.controller.js.map