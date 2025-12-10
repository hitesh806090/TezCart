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
exports.WishlistsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const wishlist_entity_1 = require("../entities/wishlist.entity");
const product_entity_1 = require("../entities/product.entity");
let WishlistsService = class WishlistsService {
    wishlistsRepository;
    productsRepository;
    constructor(wishlistsRepository, productsRepository) {
        this.wishlistsRepository = wishlistsRepository;
        this.productsRepository = productsRepository;
    }
    async addToWishlist(productId, addToWishlistDto, userId) {
        const product = await this.productsRepository.findOne({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const existing = await this.wishlistsRepository.findOne({
            where: { productId, userId },
        });
        if (existing) {
            throw new common_1.ConflictException('Product already in wishlist');
        }
        const wishlistItem = this.wishlistsRepository.create({
            ...addToWishlistDto,
            productId,
            userId,
        });
        return this.wishlistsRepository.save(wishlistItem);
    }
    async getMyWishlist(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [data, total] = await this.wishlistsRepository.findAndCount({
            where: { userId },
            relations: ['product', 'product.category'],
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
        });
        return { data, total };
    }
    async findOne(id, userId) {
        const wishlistItem = await this.wishlistsRepository.findOne({
            where: { id, userId },
            relations: ['product'],
        });
        if (!wishlistItem) {
            throw new common_1.NotFoundException('Wishlist item not found');
        }
        return wishlistItem;
    }
    async update(id, updateWishlistDto, userId) {
        const wishlistItem = await this.findOne(id, userId);
        Object.assign(wishlistItem, updateWishlistDto);
        return this.wishlistsRepository.save(wishlistItem);
    }
    async remove(id, userId) {
        const wishlistItem = await this.findOne(id, userId);
        await this.wishlistsRepository.remove(wishlistItem);
    }
    async removeByProduct(productId, userId) {
        const wishlistItem = await this.wishlistsRepository.findOne({
            where: { productId, userId },
        });
        if (!wishlistItem) {
            throw new common_1.NotFoundException('Product not in wishlist');
        }
        await this.wishlistsRepository.remove(wishlistItem);
    }
    async isInWishlist(productId, userId) {
        const count = await this.wishlistsRepository.count({
            where: { productId, userId },
        });
        return count > 0;
    }
    async getWishlistCount(userId) {
        return this.wishlistsRepository.count({
            where: { userId },
        });
    }
    async getWishlistWithPriceAlerts(userId) {
        const wishlistItems = await this.wishlistsRepository.find({
            where: { userId, notifyOnPriceChange: true },
            relations: ['product'],
        });
        return wishlistItems.filter((item) => item.desiredPrice && item.product.price <= item.desiredPrice);
    }
    async getWishlistBackInStock(userId) {
        return this.wishlistsRepository
            .createQueryBuilder('wishlist')
            .leftJoinAndSelect('wishlist.product', 'product')
            .where('wishlist.userId = :userId', { userId })
            .andWhere('wishlist.notifyOnBackInStock = :notify', { notify: true })
            .andWhere('product.stockQuantity > 0')
            .andWhere('product.status = :status', { status: 'active' })
            .getMany();
    }
};
exports.WishlistsService = WishlistsService;
exports.WishlistsService = WishlistsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wishlist_entity_1.Wishlist)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], WishlistsService);
//# sourceMappingURL=wishlists.service.js.map