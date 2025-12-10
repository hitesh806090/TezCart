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
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cart_service_1 = require("./cart.service");
const cart_dto_1 = require("./dto/cart.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let CartController = class CartController {
    cartService;
    constructor(cartService) {
        this.cartService = cartService;
    }
    getUserIdOrSession(req, sessionId) {
        const userId = req.user?.userId;
        const session = sessionId || req.headers['x-session-id'];
        return { userId, sessionId: session };
    }
    async addToCart(addToCartDto, req, sessionId) {
        const { userId, sessionId: session } = this.getUserIdOrSession(req, sessionId);
        return this.cartService.addToCart(addToCartDto, userId, session);
    }
    getCart(req, sessionId) {
        const { userId, sessionId: session } = this.getUserIdOrSession(req, sessionId);
        return this.cartService.getMyCart(userId, session);
    }
    async getCartCount(req, sessionId) {
        const { userId, sessionId: session } = this.getUserIdOrSession(req, sessionId);
        const count = await this.cartService.getCartItemCount(userId, session);
        return { count };
    }
    updateCartItem(id, updateCartItemDto, req, sessionId) {
        const { userId, sessionId: session } = this.getUserIdOrSession(req, sessionId);
        return this.cartService.updateCartItem(id, updateCartItemDto, userId, session);
    }
    removeCartItem(id, req, sessionId) {
        const { userId, sessionId: session } = this.getUserIdOrSession(req, sessionId);
        return this.cartService.removeFromCart(id, userId, session);
    }
    clearCart(req, sessionId) {
        const { userId, sessionId: session } = this.getUserIdOrSession(req, sessionId);
        return this.cartService.clearCart(userId, session);
    }
    applyCoupon(applyCouponDto, req, sessionId) {
        const { userId, sessionId: session } = this.getUserIdOrSession(req, sessionId);
        return this.cartService.applyCoupon(applyCouponDto, userId, session);
    }
    removeCoupon(req, sessionId) {
        const { userId, sessionId: session } = this.getUserIdOrSession(req, sessionId);
        return this.cartService.removeCoupon(userId, session);
    }
    mergeCart(mergeCartDto, req) {
        if (!mergeCartDto.sessionId) {
            throw new common_1.BadRequestException('Session ID is required for cart merging');
        }
        return this.cartService.mergeCart(req.user.userId, mergeCartDto.sessionId);
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.Post)('items'),
    (0, swagger_1.ApiOperation)({ summary: 'Add product to cart (works for both logged-in and guest users)' }),
    (0, swagger_1.ApiHeader)({ name: 'x-session-id', required: false, description: 'Session ID for guest users' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Product added to cart' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Product out of stock or unavailable' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Headers)('x-session-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cart_dto_1.AddToCartDto, Object, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "addToCart", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get my cart' }),
    (0, swagger_1.ApiHeader)({ name: 'x-session-id', required: false, description: 'Session ID for guest users' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns cart with items' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Headers)('x-session-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "getCart", null);
__decorate([
    (0, common_1.Get)('count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cart item count' }),
    (0, swagger_1.ApiHeader)({ name: 'x-session-id', required: false, description: 'Session ID for guest users' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns item count' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Headers)('x-session-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getCartCount", null);
__decorate([
    (0, common_1.Patch)('items/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update cart item quantity' }),
    (0, swagger_1.ApiHeader)({ name: 'x-session-id', required: false, description: 'Session ID for guest users' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cart item updated' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Insufficient stock' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Headers)('x-session-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, cart_dto_1.UpdateCartItemDto, Object, String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "updateCartItem", null);
__decorate([
    (0, common_1.Delete)('items/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove item from cart' }),
    (0, swagger_1.ApiHeader)({ name: 'x-session-id', required: false, description: 'Session ID for guest users' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item removed from cart' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Headers)('x-session-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "removeCartItem", null);
__decorate([
    (0, common_1.Delete)('clear'),
    (0, swagger_1.ApiOperation)({ summary: 'Clear all items from cart' }),
    (0, swagger_1.ApiHeader)({ name: 'x-session-id', required: false, description: 'Session ID for guest users' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cart cleared' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Headers)('x-session-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "clearCart", null);
__decorate([
    (0, common_1.Post)('coupon'),
    (0, swagger_1.ApiOperation)({ summary: 'Apply coupon code to cart' }),
    (0, swagger_1.ApiHeader)({ name: 'x-session-id', required: false, description: 'Session ID for guest users' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coupon applied' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid coupon code' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Headers)('x-session-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cart_dto_1.ApplyCouponDto, Object, String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "applyCoupon", null);
__decorate([
    (0, common_1.Delete)('coupon'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove coupon from cart' }),
    (0, swagger_1.ApiHeader)({ name: 'x-session-id', required: false, description: 'Session ID for guest users' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coupon removed' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Headers)('x-session-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "removeCoupon", null);
__decorate([
    (0, common_1.Post)('merge'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Merge guest cart with user cart after login' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Carts merged successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cart_dto_1.MergeCartDto, Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "mergeCart", null);
exports.CartController = CartController = __decorate([
    (0, swagger_1.ApiTags)('cart'),
    (0, common_1.Controller)('cart'),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map