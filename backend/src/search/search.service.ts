import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, MoreThanOrEqual } from 'typeorm';
import { Product, ProductStatus } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { SearchQueryDto, SearchSuggestionsDto, SearchType, SortOption } from './dto/search.dto';

@Injectable()
export class SearchService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
    ) { }

    async search(searchDto: SearchQueryDto): Promise<any> {
        const {
            q,
            type = SearchType.ALL,
            categoryId,
            minPrice,
            maxPrice,
            brand,
            minRating,
            inStock,
            sortBy = SortOption.RELEVANCE,
            page = 1,
            limit = 20,
        } = searchDto;

        const skip = (page - 1) * limit;
        const results: any = {
            products: null,
            categories: null,
            total: 0,
            page,
            limit,
        };

        // Search products
        if (type === SearchType.PRODUCTS || type === SearchType.ALL) {
            const queryBuilder = this.productsRepository
                .createQueryBuilder('product')
                .leftJoinAndSelect('product.category', 'category')
                .where('product.status = :status', { status: ProductStatus.ACTIVE });

            // Text search
            if (q) {
                queryBuilder.andWhere(
                    '(product.name LIKE :search OR product.description LIKE :search OR product.tags LIKE :search)',
                    { search: `%${q}%` },
                );
            }

            // Category filter
            if (categoryId) {
                queryBuilder.andWhere('product.categoryId = :categoryId', { categoryId });
            }

            // Price range filter
            if (minPrice !== undefined && maxPrice !== undefined) {
                queryBuilder.andWhere('product.price BETWEEN :minPrice AND :maxPrice', {
                    minPrice,
                    maxPrice,
                });
            } else if (minPrice !== undefined) {
                queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
            } else if (maxPrice !== undefined) {
                queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
            }

            // Brand filter
            if (brand) {
                queryBuilder.andWhere('product.brand = :brand', { brand });
            }

            // Rating filter
            if (minRating) {
                queryBuilder.andWhere('product.averageRating >= :minRating', { minRating });
            }

            // In stock filter
            if (inStock) {
                queryBuilder.andWhere('product.stockQuantity > 0');
            }

            // Sorting
            switch (sortBy) {
                case SortOption.PRICE_LOW:
                    queryBuilder.orderBy('product.price', 'ASC');
                    break;
                case SortOption.PRICE_HIGH:
                    queryBuilder.orderBy('product.price', 'DESC');
                    break;
                case SortOption.NEWEST:
                    queryBuilder.orderBy('product.createdAt', 'DESC');
                    break;
                case SortOption.RATING:
                    queryBuilder.orderBy('product.averageRating', 'DESC');
                    break;
                case SortOption.POPULAR:
                    queryBuilder.orderBy('product.totalSales', 'DESC');
                    break;
                case SortOption.RELEVANCE:
                default:
                    // For relevance, prioritize name matches over description
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

        // Search categories
        if (type === SearchType.CATEGORIES || type === SearchType.ALL) {
            if (q) {
                const [categories, categoriesTotal] = await this.categoriesRepository.findAndCount({
                    where: [
                        { name: Like(`%${q}%`), isActive: true },
                        { description: Like(`%${q}%`), isActive: true },
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

        // Add search suggestions/filters
        results.filters = await this.getSearchFilters(searchDto);

        return results;
    }

    async getSuggestions(suggestDto: SearchSuggestionsDto): Promise<any> {
        const { q, limit = 10 } = suggestDto;

        if (!q || q.length < 2) {
            return { suggestions: [] };
        }

        // Get product name suggestions
        const products = await this.productsRepository
            .createQueryBuilder('product')
            .select(['product.name', 'product.id'])
            .where('product.name LIKE :search', { search: `%${q}%` })
            .andWhere('product.status = :status', { status: ProductStatus.ACTIVE })
            .limit(limit)
            .getMany();

        // Get popular search terms (from product tags)
        const popularProducts = await this.productsRepository
            .createQueryBuilder('product')
            .select(['product.tags', 'product.name'])
            .where('product.tags LIKE :search', { search: `%${q}%` })
            .andWhere('product.status = :status', { status: ProductStatus.ACTIVE })
            .orderBy('product.totalSales', 'DESC')
            .limit(5)
            .getMany();

        const suggestions = [
            ...products.map(p => ({ type: 'product', text: p.name, id: p.id })),
        ];

        // Extract unique tags
        const tags = new Set<string>();
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

    async getPopularSearches(limit: number = 10): Promise<any> {
        // Get most viewed/sold products as popular searches
        const popularProducts = await this.productsRepository
            .createQueryBuilder('product')
            .select(['product.name', 'product.id', 'product.viewCount', 'product.totalSales'])
            .where('product.status = :status', { status: ProductStatus.ACTIVE })
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

    async getTrendingProducts(limit: number = 10): Promise<Product[]> {
        // Get products with highest recent views and sales
        return this.productsRepository
            .createQueryBuilder('product')
            .where('product.status = :status', { status: ProductStatus.ACTIVE })
            .orderBy('product.viewCount', 'DESC')
            .addOrderBy('product.totalSales', 'DESC')
            .limit(limit)
            .getMany();
    }

    private async getSearchFilters(searchDto: SearchQueryDto): Promise<any> {
        const { q, categoryId } = searchDto;

        const queryBuilder = this.productsRepository
            .createQueryBuilder('product')
            .where('product.status = :status', { status: ProductStatus.ACTIVE });

        if (q) {
            queryBuilder.andWhere(
                '(product.name LIKE :search OR product.description LIKE :search)',
                { search: `%${q}%` },
            );
        }

        if (categoryId) {
            queryBuilder.andWhere('product.categoryId = :categoryId', { categoryId });
        }

        const products = await queryBuilder.getMany();

        // Extract unique brands
        const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];

        // Get price range
        const prices = products.map(p => Number(p.price));
        const priceRange = {
            min: prices.length ? Math.min(...prices) : 0,
            max: prices.length ? Math.max(...prices) : 0,
        };

        // Get available categories
        const categoryIds = [...new Set(products.map(p => p.categoryId))];
        const categories = await this.categoriesRepository.findByIds(categoryIds);

        return {
            brands,
            priceRange,
            categories: categories.map(c => ({ id: c.id, name: c.name })),
        };
    }
}
