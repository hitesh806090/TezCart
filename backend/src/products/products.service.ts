import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like, Between } from 'typeorm';
import { Product, ProductStatus } from '../entities/product.entity';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) { }

    // Generate slug from name
    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    async create(createProductDto: CreateProductDto, sellerId: string): Promise<Product> {
        const slug = this.generateSlug(createProductDto.name);

        const product = this.productsRepository.create({
            ...createProductDto,
            slug,
            sellerId,
        });

        // Auto-update status based on stock if tracking inventory
        if (product.trackInventory && product.stockQuantity === 0) {
            product.status = ProductStatus.OUT_OF_STOCK;
        }

        return this.productsRepository.save(product);
    }

    async findAll(query: ProductQueryDto): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
        const {
            page = 1,
            limit = 20,
            search,
            categoryId,
            sellerId,
            status,
            brand,
            minPrice,
            maxPrice,
            sortBy = 'createdAt',
            sortOrder = 'DESC',
            isFeatured,
        } = query;

        const skip = (page - 1) * limit;

        const where: FindOptionsWhere<Product> = {};

        // Build query filters
        if (search) {
            where.name = Like(`%${search}%`);
        }

        if (categoryId) {
            where.categoryId = categoryId;
        }

        if (sellerId) {
            where.sellerId = sellerId;
        }

        if (status) {
            where.status = status;
        } else {
            // Default: only show active products for public
            where.status = ProductStatus.ACTIVE;
        }

        if (brand) {
            where.brand = brand;
        }

        if (isFeatured !== undefined) {
            where.isFeatured = isFeatured;
        }

        // Price range filtering (handled separately in query builder)
        const queryBuilder = this.productsRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.seller', 'seller')
            .where(where);

        if (minPrice !== undefined || maxPrice !== undefined) {
            if (minPrice !== undefined && maxPrice !== undefined) {
                queryBuilder.andWhere('product.price BETWEEN :minPrice AND :maxPrice', { minPrice, maxPrice });
            } else if (minPrice !== undefined) {
                queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
            } else if (maxPrice !== undefined) {
                queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
            }
        }

        // Sorting
        const orderDirection = sortOrder === 'ASC' ? 'ASC' : 'DESC';
        queryBuilder.orderBy(`product.${sortBy}`, orderDirection);

        // Pagination
        queryBuilder.skip(skip).take(limit);

        const [data, total] = await queryBuilder.getManyAndCount();

        return {
            data,
            total,
            page,
            limit,
        };
    }

    async findOne(id: string): Promise<Product> {
        const product = await this.productsRepository.findOne({
            where: { id },
            relations: ['category', 'seller'],
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        // Increment view count
        await this.incrementViewCount(id);

        return product;
    }

    async findBySlug(slug: string): Promise<Product> {
        const product = await this.productsRepository.findOne({
            where: { slug },
            relations: ['category', 'seller'],
        });

        if (!product) {
            throw new NotFoundException(`Product with slug ${slug} not found`);
        }

        // Increment view count
        await this.incrementViewCount(product.id);

        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto, userId: string, userRole: string): Promise<Product> {
        const product = await this.findOne(id);

        // Check if user is the seller or admin
        if (product.sellerId !== userId && userRole !== 'admin') {
            throw new ForbiddenException('You do not have permission to update this product');
        }

        // Update slug if name changed
        if (updateProductDto.name && updateProductDto.name !== product.name) {
            product.slug = this.generateSlug(updateProductDto.name);
        }

        Object.assign(product, updateProductDto);

        // Auto-update status based on stock if tracking inventory
        if (product.trackInventory) {
            if (product.stockQuantity === 0) {
                product.status = ProductStatus.OUT_OF_STOCK;
            } else if (product.status === ProductStatus.OUT_OF_STOCK && product.stockQuantity > 0) {
                product.status = ProductStatus.ACTIVE;
            }
        }

        return this.productsRepository.save(product);
    }

    async remove(id: string, userId: string, userRole: string): Promise<void> {
        const product = await this.findOne(id);

        // Check if user is the seller or admin
        if (product.sellerId !== userId && userRole !== 'admin') {
            throw new ForbiddenException('You do not have permission to delete this product');
        }

        await this.productsRepository.remove(product);
    }

    async incrementViewCount(id: string): Promise<void> {
        await this.productsRepository.increment({ id }, 'viewCount', 1);
    }

    async updateStock(id: string, quantity: number): Promise<Product> {
        const product = await this.findOne(id);

        product.stockQuantity = quantity;

        // Auto-update status based on stock
        if (product.trackInventory) {
            if (quantity === 0) {
                product.status = ProductStatus.OUT_OF_STOCK;
            } else if (product.status === ProductStatus.OUT_OF_STOCK && quantity > 0) {
                product.status = ProductStatus.ACTIVE;
            }
        }

        return this.productsRepository.save(product);
    }

    async decrementStock(id: string, quantity: number): Promise<Product> {
        const product = await this.findOne(id);

        if (product.trackInventory && product.stockQuantity < quantity) {
            throw new ForbiddenException('Insufficient stock');
        }

        product.stockQuantity = Math.max(0, product.stockQuantity - quantity);

        // Auto-update status based on stock
        if (product.trackInventory && product.stockQuantity === 0) {
            product.status = ProductStatus.OUT_OF_STOCK;
        }

        return this.productsRepository.save(product);
    }

    async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
        return this.productsRepository.find({
            where: {
                isFeatured: true,
                status: ProductStatus.ACTIVE,
                isActive: true,
            },
            relations: ['category', 'seller'],
            take: limit,
            order: { createdAt: 'DESC' },
        });
    }

    async getRelatedProducts(productId: string, limit: number = 5): Promise<Product[]> {
        const product = await this.findOne(productId);

        return this.productsRepository.find({
            where: {
                categoryId: product.categoryId,
                status: ProductStatus.ACTIVE,
                isActive: true,
            },
            relations: ['category', 'seller'],
            take: limit,
            order: { averageRating: 'DESC' },
        });
    }
}
