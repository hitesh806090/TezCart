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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../entities/product.entity");
let ProductsService = class ProductsService {
    productsRepository;
    constructor(productsRepository) {
        this.productsRepository = productsRepository;
    }
    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    async create(createProductDto, sellerId) {
        const slug = this.generateSlug(createProductDto.name);
        const product = this.productsRepository.create({
            ...createProductDto,
            slug,
            sellerId,
        });
        if (product.trackInventory && product.stockQuantity === 0) {
            product.status = product_entity_1.ProductStatus.OUT_OF_STOCK;
        }
        return this.productsRepository.save(product);
    }
    async findAll(query) {
        const { page = 1, limit = 20, search, categoryId, sellerId, status, brand, minPrice, maxPrice, sortBy = 'createdAt', sortOrder = 'DESC', isFeatured, } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.name = (0, typeorm_2.Like)(`%${search}%`);
        }
        if (categoryId) {
            where.categoryId = categoryId;
        }
        if (sellerId) {
            where.sellerId = sellerId;
        }
        if (status) {
            where.status = status;
        }
        else {
            where.status = product_entity_1.ProductStatus.ACTIVE;
        }
        if (brand) {
            where.brand = brand;
        }
        if (isFeatured !== undefined) {
            where.isFeatured = isFeatured;
        }
        const queryBuilder = this.productsRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.seller', 'seller')
            .where(where);
        if (minPrice !== undefined || maxPrice !== undefined) {
            if (minPrice !== undefined && maxPrice !== undefined) {
                queryBuilder.andWhere('product.price BETWEEN :minPrice AND :maxPrice', { minPrice, maxPrice });
            }
            else if (minPrice !== undefined) {
                queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
            }
            else if (maxPrice !== undefined) {
                queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
            }
        }
        const orderDirection = sortOrder === 'ASC' ? 'ASC' : 'DESC';
        queryBuilder.orderBy(`product.${sortBy}`, orderDirection);
        queryBuilder.skip(skip).take(limit);
        const [data, total] = await queryBuilder.getManyAndCount();
        return {
            data,
            total,
            page,
            limit,
        };
    }
    async findOne(id) {
        const product = await this.productsRepository.findOne({
            where: { id },
            relations: ['category', 'seller'],
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        await this.incrementViewCount(id);
        return product;
    }
    async findBySlug(slug) {
        const product = await this.productsRepository.findOne({
            where: { slug },
            relations: ['category', 'seller'],
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with slug ${slug} not found`);
        }
        await this.incrementViewCount(product.id);
        return product;
    }
    async update(id, updateProductDto, userId, userRole) {
        const product = await this.findOne(id);
        if (product.sellerId !== userId && userRole !== 'admin') {
            throw new common_1.ForbiddenException('You do not have permission to update this product');
        }
        if (updateProductDto.name && updateProductDto.name !== product.name) {
            product.slug = this.generateSlug(updateProductDto.name);
        }
        Object.assign(product, updateProductDto);
        if (product.trackInventory) {
            if (product.stockQuantity === 0) {
                product.status = product_entity_1.ProductStatus.OUT_OF_STOCK;
            }
            else if (product.status === product_entity_1.ProductStatus.OUT_OF_STOCK && product.stockQuantity > 0) {
                product.status = product_entity_1.ProductStatus.ACTIVE;
            }
        }
        return this.productsRepository.save(product);
    }
    async remove(id, userId, userRole) {
        const product = await this.findOne(id);
        if (product.sellerId !== userId && userRole !== 'admin') {
            throw new common_1.ForbiddenException('You do not have permission to delete this product');
        }
        await this.productsRepository.remove(product);
    }
    async incrementViewCount(id) {
        await this.productsRepository.increment({ id }, 'viewCount', 1);
    }
    async updateStock(id, quantity) {
        const product = await this.findOne(id);
        product.stockQuantity = quantity;
        if (product.trackInventory) {
            if (quantity === 0) {
                product.status = product_entity_1.ProductStatus.OUT_OF_STOCK;
            }
            else if (product.status === product_entity_1.ProductStatus.OUT_OF_STOCK && quantity > 0) {
                product.status = product_entity_1.ProductStatus.ACTIVE;
            }
        }
        return this.productsRepository.save(product);
    }
    async decrementStock(id, quantity) {
        const product = await this.findOne(id);
        if (product.trackInventory && product.stockQuantity < quantity) {
            throw new common_1.ForbiddenException('Insufficient stock');
        }
        product.stockQuantity = Math.max(0, product.stockQuantity - quantity);
        if (product.trackInventory && product.stockQuantity === 0) {
            product.status = product_entity_1.ProductStatus.OUT_OF_STOCK;
        }
        return this.productsRepository.save(product);
    }
    async getFeaturedProducts(limit = 10) {
        return this.productsRepository.find({
            where: {
                isFeatured: true,
                status: product_entity_1.ProductStatus.ACTIVE,
                isActive: true,
            },
            relations: ['category', 'seller'],
            take: limit,
            order: { createdAt: 'DESC' },
        });
    }
    async getRelatedProducts(productId, limit = 5) {
        const product = await this.findOne(productId);
        return this.productsRepository.find({
            where: {
                categoryId: product.categoryId,
                status: product_entity_1.ProductStatus.ACTIVE,
                isActive: true,
            },
            relations: ['category', 'seller'],
            take: limit,
            order: { averageRating: 'DESC' },
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map