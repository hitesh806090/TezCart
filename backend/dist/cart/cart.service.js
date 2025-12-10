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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cart_entity_1 = require("../entities/cart.entity");
const cart_item_entity_1 = require("../entities/cart-item.entity");
const product_entity_1 = require("../entities/product.entity");
let CartService = class CartService {
    cartsRepository;
    cartItemsRepository;
    productsRepository;
    constructor(cartsRepository, cartItemsRepository, productsRepository) {
        this.cartsRepository = cartsRepository;
        this.cartItemsRepository = cartItemsRepository;
        this.productsRepository = productsRepository;
    }
    async getOrCreateCart(userId, sessionId) {
        let cart = null;
        if (userId) {
            cart = await this.cartsRepository.findOne({
                where: { userId, status: cart_entity_1.CartStatus.ACTIVE },
                relations: ['items', 'items.product'],
            });
        }
        else if (sessionId) {
            cart = await this.cartsRepository.findOne({
                where: { sessionId, status: cart_entity_1.CartStatus.ACTIVE },
                relations: ['items', 'items.product'],
            });
        }
        if (!cart) {
            cart = this.cartsRepository.create({
                userId,
                sessionId,
                status: cart_entity_1.CartStatus.ACTIVE,
            });
            await this.cartsRepository.save(cart);
        }
        return cart;
    }
    async addToCart(addToCartDto, userId, sessionId) {
        const { productId, quantity } = addToCartDto;
        const product = await this.productsRepository.findOne({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.status !== product_entity_1.ProductStatus.ACTIVE) {
            throw new common_1.BadRequestException('Product is not available');
        }
        if (product.trackInventory && product.stockQuantity < quantity) {
            throw new common_1.BadRequestException(`Only ${product.stockQuantity} items available in stock`);
        }
        const cart = await this.getOrCreateCart(userId, sessionId);
        let cartItem = await this.cartItemsRepository.findOne({
            where: { cartId: cart.id, productId },
        });
        if (cartItem) {
            const newQuantity = cartItem.quantity + quantity;
            if (product.trackInventory && product.stockQuantity < newQuantity) {
                throw new common_1.BadRequestException(`Only ${product.stockQuantity} items available in stock`);
            }
            cartItem.quantity = newQuantity;
            cartItem.subtotal = (product.price - cartItem.discount) * newQuantity;
        }
        else {
            cartItem = this.cartItemsRepository.create({
                cartId: cart.id,
                productId,
                quantity,
                price: product.price,
                discount: 0,
                subtotal: product.price * quantity,
                productSnapshot: {
                    name: product.name,
                    image: product.images?.[0] || '',
                    sku: product.sku || '',
                    seller: product.sellerId,
                },
                isAvailable: true,
            });
        }
        await this.cartItemsRepository.save(cartItem);
        await this.calculateCartTotals(cart.id);
        return this.getCart(cart.id);
    }
    async getCart(cartId) {
        const cart = await this.cartsRepository.findOne({
            where: { id: cartId },
            relations: ['items', 'items.product'],
        });
        if (!cart) {
            throw new common_1.NotFoundException('Cart not found');
        }
        await this.updateItemsAvailability(cart);
        return cart;
    }
    async getMyCart(userId, sessionId) {
        const cart = await this.getOrCreateCart(userId, sessionId);
        await this.updateItemsAvailability(cart);
        return cart;
    }
    async updateCartItem(cartItemId, updateCartItemDto, userId, sessionId) {
        const cartItem = await this.cartItemsRepository.findOne({
            where: { id: cartItemId },
            relations: ['cart', 'product'],
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        if (userId && cartItem.cart.userId !== userId) {
            throw new common_1.BadRequestException('This cart does not belong to you');
        }
        if (sessionId && cartItem.cart.sessionId !== sessionId) {
            throw new common_1.BadRequestException('This cart does not belong to you');
        }
        const { quantity } = updateCartItemDto;
        const product = cartItem.product;
        if (product.trackInventory && product.stockQuantity < quantity) {
            throw new common_1.BadRequestException(`Only ${product.stockQuantity} items available in stock`);
        }
        cartItem.quantity = quantity;
        cartItem.price = product.price;
        cartItem.subtotal = (product.price - cartItem.discount) * quantity;
        await this.cartItemsRepository.save(cartItem);
        await this.calculateCartTotals(cartItem.cartId);
        return this.getCart(cartItem.cartId);
    }
    async removeFromCart(cartItemId, userId, sessionId) {
        const cartItem = await this.cartItemsRepository.findOne({
            where: { id: cartItemId },
            relations: ['cart'],
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        if (userId && cartItem.cart.userId !== userId) {
            throw new common_1.BadRequestException('This cart does not belong to you');
        }
        if (sessionId && cartItem.cart.sessionId !== sessionId) {
            throw new common_1.BadRequestException('This cart does not belong to you');
        }
        const cartId = cartItem.cartId;
        await this.cartItemsRepository.remove(cartItem);
        await this.calculateCartTotals(cartId);
        return this.getCart(cartId);
    }
    async clearCart(userId, sessionId) {
        const cart = await this.getOrCreateCart(userId, sessionId);
        await this.cartItemsRepository.delete({ cartId: cart.id });
        cart.subtotal = 0;
        cart.tax = 0;
        cart.shipping = 0;
        cart.discount = 0;
        cart.total = 0;
        cart.itemCount = 0;
        await this.cartsRepository.save(cart);
    }
    async applyCoupon(applyCouponDto, userId, sessionId) {
        const cart = await this.getOrCreateCart(userId, sessionId);
        cart.couponCode = applyCouponDto.couponCode;
        await this.cartsRepository.save(cart);
        await this.calculateCartTotals(cart.id);
        return this.getCart(cart.id);
    }
    async removeCoupon(userId, sessionId) {
        const cart = await this.getOrCreateCart(userId, sessionId);
        cart.discount = 0;
        await this.cartsRepository.save(cart);
        await this.calculateCartTotals(cart.id);
        return this.getCart(cart.id);
    }
    async mergeCart(userId, guestSessionId) {
        const userCart = await this.getOrCreateCart(userId);
        const guestCart = await this.cartsRepository.findOne({
            where: { sessionId: guestSessionId, status: cart_entity_1.CartStatus.ACTIVE },
            relations: ['items'],
        });
        if (!guestCart || guestCart.items.length === 0) {
            return userCart;
        }
        for (const guestItem of guestCart.items) {
            const existingItem = await this.cartItemsRepository.findOne({
                where: { cartId: userCart.id, productId: guestItem.productId },
            });
            if (existingItem) {
                existingItem.quantity += guestItem.quantity;
                existingItem.subtotal =
                    (existingItem.price - existingItem.discount) * existingItem.quantity;
                await this.cartItemsRepository.save(existingItem);
            }
            else {
                guestItem.cartId = userCart.id;
                await this.cartItemsRepository.save(guestItem);
            }
        }
        guestCart.status = cart_entity_1.CartStatus.CONVERTED;
        await this.cartsRepository.save(guestCart);
        await this.calculateCartTotals(userCart.id);
        return this.getCart(userCart.id);
    }
    async calculateCartTotals(cartId) {
        const cart = await this.cartsRepository.findOne({
            where: { id: cartId },
            relations: ['items'],
        });
        if (!cart) {
            return;
        }
        let subtotal = 0;
        let itemCount = 0;
        for (const item of cart.items) {
            subtotal += Number(item.subtotal);
            itemCount += item.quantity;
        }
        const taxRate = 0.1;
        const tax = subtotal * taxRate;
        const shipping = subtotal >= 50 ? 0 : 5;
        const discount = 0;
        const total = subtotal + tax + shipping - discount;
        cart.subtotal = subtotal;
        cart.tax = tax;
        cart.shipping = shipping;
        cart.discount = discount;
        cart.total = total;
        cart.itemCount = itemCount;
        await this.cartsRepository.save(cart);
    }
    async updateItemsAvailability(cart) {
        for (const item of cart.items) {
            if (!item.product) {
                item.isAvailable = false;
                continue;
            }
            const product = item.product;
            if (product.status !== product_entity_1.ProductStatus.ACTIVE) {
                item.isAvailable = false;
            }
            else if (product.trackInventory && product.stockQuantity < item.quantity) {
                item.isAvailable = false;
            }
            else {
                item.isAvailable = true;
            }
            await this.cartItemsRepository.save(item);
        }
    }
    async getCartItemCount(userId, sessionId) {
        const cart = await this.getOrCreateCart(userId, sessionId);
        return cart.itemCount;
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cart_entity_1.Cart)),
    __param(1, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItem)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CartService);
//# sourceMappingURL=cart.service.js.map