import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from '../entities/wishlist.entity';
import { Product } from '../entities/product.entity';
import { AddToWishlistDto, UpdateWishlistDto } from './dto/wishlist.dto';

@Injectable()
export class WishlistsService {
    constructor(
        @InjectRepository(Wishlist)
        private wishlistsRepository: Repository<Wishlist>,
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) { }

    async addToWishlist(
        productId: string,
        addToWishlistDto: AddToWishlistDto,
        userId: string,
    ): Promise<Wishlist> {
        // Check if product exists
        const product = await this.productsRepository.findOne({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Check if already in wishlist
        const existing = await this.wishlistsRepository.findOne({
            where: { productId, userId },
        });

        if (existing) {
            throw new ConflictException('Product already in wishlist');
        }

        const wishlistItem = this.wishlistsRepository.create({
            ...addToWishlistDto,
            productId,
            userId,
        });

        return this.wishlistsRepository.save(wishlistItem);
    }

    async getMyWishlist(
        userId: string,
        page: number = 1,
        limit: number = 20,
    ): Promise<{ data: Wishlist[]; total: number }> {
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

    async findOne(id: string, userId: string): Promise<Wishlist> {
        const wishlistItem = await this.wishlistsRepository.findOne({
            where: { id, userId },
            relations: ['product'],
        });

        if (!wishlistItem) {
            throw new NotFoundException('Wishlist item not found');
        }

        return wishlistItem;
    }

    async update(
        id: string,
        updateWishlistDto: UpdateWishlistDto,
        userId: string,
    ): Promise<Wishlist> {
        const wishlistItem = await this.findOne(id, userId);

        Object.assign(wishlistItem, updateWishlistDto);

        return this.wishlistsRepository.save(wishlistItem);
    }

    async remove(id: string, userId: string): Promise<void> {
        const wishlistItem = await this.findOne(id, userId);
        await this.wishlistsRepository.remove(wishlistItem);
    }

    async removeByProduct(productId: string, userId: string): Promise<void> {
        const wishlistItem = await this.wishlistsRepository.findOne({
            where: { productId, userId },
        });

        if (!wishlistItem) {
            throw new NotFoundException('Product not in wishlist');
        }

        await this.wishlistsRepository.remove(wishlistItem);
    }

    async isInWishlist(productId: string, userId: string): Promise<boolean> {
        const count = await this.wishlistsRepository.count({
            where: { productId, userId },
        });

        return count > 0;
    }

    async getWishlistCount(userId: string): Promise<number> {
        return this.wishlistsRepository.count({
            where: { userId },
        });
    }

    // Get all products in wishlist with price drops
    async getWishlistWithPriceAlerts(userId: string): Promise<Wishlist[]> {
        const wishlistItems = await this.wishlistsRepository.find({
            where: { userId, notifyOnPriceChange: true },
            relations: ['product'],
        });

        // Filter items where current price is <= desired price
        return wishlistItems.filter(
            (item) => item.desiredPrice && item.product.price <= item.desiredPrice,
        );
    }

    // Get all products in wishlist that are back in stock
    async getWishlistBackInStock(userId: string): Promise<Wishlist[]> {
        return this.wishlistsRepository
            .createQueryBuilder('wishlist')
            .leftJoinAndSelect('wishlist.product', 'product')
            .where('wishlist.userId = :userId', { userId })
            .andWhere('wishlist.notifyOnBackInStock = :notify', { notify: true })
            .andWhere('product.stockQuantity > 0')
            .andWhere('product.status = :status', { status: 'active' })
            .getMany();
    }
}
