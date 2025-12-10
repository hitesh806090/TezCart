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
exports.SellersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const seller_entity_1 = require("../entities/seller.entity");
const product_entity_1 = require("../entities/product.entity");
const order_entity_1 = require("../entities/order.entity");
let SellersService = class SellersService {
    sellersRepository;
    productsRepository;
    ordersRepository;
    constructor(sellersRepository, productsRepository, ordersRepository) {
        this.sellersRepository = sellersRepository;
        this.productsRepository = productsRepository;
        this.ordersRepository = ordersRepository;
    }
    async create(createSellerDto, userId) {
        const existing = await this.sellersRepository.findOne({ where: { userId } });
        if (existing) {
            throw new common_1.ConflictException('User already has a seller account');
        }
        const shopExists = await this.sellersRepository.findOne({
            where: { shopName: createSellerDto.shopName },
        });
        if (shopExists) {
            throw new common_1.ConflictException('Shop name already taken');
        }
        const shopSlug = createSellerDto.shopName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        const seller = this.sellersRepository.create({
            ...createSellerDto,
            userId,
            shopSlug,
            status: seller_entity_1.SellerStatus.PENDING,
        });
        return this.sellersRepository.save(seller);
    }
    async findAll(status) {
        const query = {};
        if (status) {
            query.status = status;
        }
        return this.sellersRepository.find({
            where: query,
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const seller = await this.sellersRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!seller) {
            throw new common_1.NotFoundException('Seller not found');
        }
        return seller;
    }
    async findByUserId(userId) {
        return this.sellersRepository.findOne({
            where: { userId },
            relations: ['user'],
        });
    }
    async findBySlug(slug) {
        const seller = await this.sellersRepository.findOne({
            where: { shopSlug: slug },
            relations: ['user'],
        });
        if (!seller) {
            throw new common_1.NotFoundException('Seller not found');
        }
        return seller;
    }
    async update(id, updateSellerDto, userId) {
        const seller = await this.findOne(id);
        if (seller.userId !== userId) {
            throw new common_1.BadRequestException('You do not own this seller account');
        }
        if (updateSellerDto.shopName && updateSellerDto.shopName !== seller.shopName) {
            const shopExists = await this.sellersRepository.findOne({
                where: { shopName: updateSellerDto.shopName },
            });
            if (shopExists && shopExists.id !== id) {
                throw new common_1.ConflictException('Shop name already taken');
            }
            seller.shopSlug = updateSellerDto.shopName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }
        Object.assign(seller, updateSellerDto);
        return this.sellersRepository.save(seller);
    }
    async approve(id, approveDto) {
        const seller = await this.findOne(id);
        if (seller.status === seller_entity_1.SellerStatus.APPROVED) {
            throw new common_1.BadRequestException('Seller already approved');
        }
        seller.status = seller_entity_1.SellerStatus.APPROVED;
        seller.approvedAt = new Date();
        if (approveDto.commissionRate !== undefined) {
            seller.commissionRate = approveDto.commissionRate;
        }
        return this.sellersRepository.save(seller);
    }
    async reject(id, rejectDto) {
        const seller = await this.findOne(id);
        seller.status = seller_entity_1.SellerStatus.REJECTED;
        seller.rejectionReason = rejectDto.reason;
        return this.sellersRepository.save(seller);
    }
    async suspend(id, reason) {
        const seller = await this.findOne(id);
        seller.status = seller_entity_1.SellerStatus.SUSPENDED;
        seller.isActive = false;
        seller.rejectionReason = reason;
        return this.sellersRepository.save(seller);
    }
    async activate(id) {
        const seller = await this.findOne(id);
        if (seller.status !== seller_entity_1.SellerStatus.APPROVED) {
            throw new common_1.BadRequestException('Seller must be approved first');
        }
        seller.isActive = true;
        return this.sellersRepository.save(seller);
    }
    async getStats(sellerId) {
        const seller = await this.findOne(sellerId);
        const products = await this.productsRepository.find({
            where: { sellerId: seller.userId },
        });
        const orders = await this.ordersRepository
            .createQueryBuilder('order')
            .leftJoin('order.items', 'items')
            .where('items.sellerId = :sellerId', { sellerId: seller.userId })
            .getMany();
        const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
        const totalOrders = orders.length;
        return {
            seller,
            totalProducts: products.length,
            activeProducts: products.filter(p => p.status === 'active').length,
            totalOrders,
            totalRevenue,
            averageRating: seller.rating,
            totalReviews: seller.totalReviews,
        };
    }
    async getMyShop(userId) {
        const seller = await this.findByUserId(userId);
        if (!seller) {
            throw new common_1.NotFoundException('You do not have a seller account');
        }
        return seller;
    }
};
exports.SellersService = SellersService;
exports.SellersService = SellersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(seller_entity_1.Seller)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(2, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SellersService);
//# sourceMappingURL=sellers.service.js.map