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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../entities/product.entity");
const category_entity_1 = require("../entities/category.entity");
const search_dto_1 = require("./dto/search.dto");
let SearchService = class SearchService {
    productsRepository;
    categoriesRepository;
    constructor(productsRepository, categoriesRepository) {
        this.productsRepository = productsRepository;
        this.categoriesRepository = categoriesRepository;
    }
    async search(searchDto) {
        const { q, type = search_dto_1.SearchType.ALL, categoryId, minPrice, maxPrice, brand, minRating, inStock, sortBy = search_dto_1.SortOption.RELEVANCE, page = 1, limit = 20, } = searchDto;
        const skip = (page - 1) * limit;
        const results = {
            products: null,
            categories: null,
            total: 0,
            page,
            limit,
        };
        if (type === search_dto_1.SearchType.PRODUCTS || type === search_dto_1.SearchType.ALL) {
            const queryBuilder = this.productsRepository
                .createQueryBuilder('product')
                .leftJoinAndSelect('product.category', 'category')
                .where('product.status = :status', { status: product_entity_1.ProductStatus.ACTIVE });
            if (q) {
                queryBuilder.andWhere('(product.name LIKE :search OR product.description LIKE :search OR product.tags LIKE :search)', { search: `%${q}%` });
            }
            if (categoryId) {
                queryBuilder.andWhere('product.categoryId = :categoryId', { categoryId });
            }
            if (minPrice !== undefined && maxPrice !== undefined) {
                queryBuilder.andWhere('product.price BETWEEN :minPrice AND :maxPrice', {
                    minPrice,
                    maxPrice,
                });
            }
            else if (minPrice !== undefined) {
                queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
            }
            else if (maxPrice !== undefined) {
                queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
            }
            if (brand) {
                queryBuilder.andWhere('product.brand = :brand', { brand });
            }
            if (minRating) {
                queryBuilder.andWhere('product.averageRating >= :minRating', { minRating });
            }
            if (inStock) {
                queryBuilder.andWhere('product.stockQuantity > 0');
            }
            switch (sortBy) {
                case search_dto_1.SortOption.PRICE_LOW:
                    queryBuilder.orderBy('product.price', 'ASC');
                    break;
                case search_dto_1.SortOption.PRICE_HIGH:
                    queryBuilder.orderBy('product.price', 'DESC');
                    break;
                case search_dto_1.SortOption.NEWEST:
                    queryBuilder.orderBy('product.createdAt', 'DESC');
                    break;
                case search_dto_1.SortOption.RATING:
                    queryBuilder.orderBy('product.averageRating', 'DESC');
                    break;
                case search_dto_1.SortOption.POPULAR:
                    queryBuilder.orderBy('product.totalSales', 'DESC');
                    break;
                case search_dto_1.SortOption.RELEVANCE:
                default:
                    if (q) {
                        queryBuilder.orderBy('product.viewCount', 'DESC');
                    }
                    break;
            }
            queryBuilder.skip(skip).take(limit);
            const [products, productsTotal] = await queryBuilder.getManyAndCount();
            results.products = {
                data: products,
                total: productsTotal,
            };
            results.total += productsTotal;
        }
        if (type === search_dto_1.SearchType.CATEGORIES || type === search_dto_1.SearchType.ALL) {
            if (q) {
                const [categories, categoriesTotal] = await this.categoriesRepository.findAndCount({
                    where: [
                        { name: (0, typeorm_2.Like)(`%${q}%`), isActive: true },
                        { description: (0, typeorm_2.Like)(`%${q}%`), isActive: true },
                    ],
                    take: limit,
                    skip: skip,
                });
                results.categories = {
                    data: categories,
                    total: categoriesTotal,
                };
                results.total += categoriesTotal;
            }
        }
        results.filters = await this.getSearchFilters(searchDto);
        return results;
    }
    async getSuggestions(suggestDto) {
        const { q, limit = 10 } = suggestDto;
        if (!q || q.length < 2) {
            return { suggestions: [] };
        }
        const products = await this.productsRepository
            .createQueryBuilder('product')
            .select(['product.name', 'product.id'])
            .where('product.name LIKE :search', { search: `%${q}%` })
            .andWhere('product.status = :status', { status: product_entity_1.ProductStatus.ACTIVE })
            .limit(limit)
            .getMany();
        const popularProducts = await this.productsRepository
            .createQueryBuilder('product')
            .select(['product.tags', 'product.name'])
            .where('product.tags LIKE :search', { search: `%${q}%` })
            .andWhere('product.status = :status', { status: product_entity_1.ProductStatus.ACTIVE })
            .orderBy('product.totalSales', 'DESC')
            .limit(5)
            .getMany();
        const suggestions = [
            ...products.map(p => ({ type: 'product', text: p.name, id: p.id })),
        ];
        const tags = new Set();
        popularProducts.forEach(p => {
            if (p.tags) {
                p.tags.forEach(tag => {
                    if (tag.toLowerCase().includes(q.toLowerCase())) {
                        tags.add(tag);
                    }
                });
            }
        });
        tags.forEach(tag => {
            if (suggestions.length < limit) {
                suggestions.push({ type: 'tag', text: tag, id: tag.toLowerCase().replace(/\s+/g, '-') });
            }
        });
        return {
            suggestions: suggestions.slice(0, limit),
            query: q,
        };
    }
    async getPopularSearches(limit = 10) {
        const popularProducts = await this.productsRepository
            .createQueryBuilder('product')
            .select(['product.name', 'product.id', 'product.viewCount', 'product.totalSales'])
            .where('product.status = :status', { status: product_entity_1.ProductStatus.ACTIVE })
            .orderBy('product.totalSales', 'DESC')
            .addOrderBy('product.viewCount', 'DESC')
            .limit(limit)
            .getMany();
        return {
            popular: popularProducts.map(p => ({
                text: p.name,
                id: p.id,
                views: p.viewCount,
                sales: p.totalSales,
            })),
        };
    }
    async getTrendingProducts(limit = 10) {
        return this.productsRepository
            .createQueryBuilder('product')
            .where('product.status = :status', { status: product_entity_1.ProductStatus.ACTIVE })
            .orderBy('product.viewCount', 'DESC')
            .addOrderBy('product.totalSales', 'DESC')
            .limit(limit)
            .getMany();
    }
    async getSearchFilters(searchDto) {
        const { q, categoryId } = searchDto;
        const queryBuilder = this.productsRepository
            .createQueryBuilder('product')
            .where('product.status = :status', { status: product_entity_1.ProductStatus.ACTIVE });
        if (q) {
            queryBuilder.andWhere('(product.name LIKE :search OR product.description LIKE :search)', { search: `%${q}%` });
        }
        if (categoryId) {
            queryBuilder.andWhere('product.categoryId = :categoryId', { categoryId });
        }
        const products = await queryBuilder.getMany();
        const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
        const prices = products.map(p => Number(p.price));
        const priceRange = {
            min: prices.length ? Math.min(...prices) : 0,
            max: prices.length ? Math.max(...prices) : 0,
        };
        const categoryIds = [...new Set(products.map(p => p.categoryId))];
        const categories = await this.categoriesRepository.findByIds(categoryIds);
        return {
            brands,
            priceRange,
            categories: categories.map(c => ({ id: c.id, name: c.name })),
        };
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SearchService);
//# sourceMappingURL=search.service.js.map