import { Repository } from 'typeorm';
import { Wishlist } from '../entities/wishlist.entity';
import { Product } from '../entities/product.entity';
import { AddToWishlistDto, UpdateWishlistDto } from './dto/wishlist.dto';
export declare class WishlistsService {
    private wishlistsRepository;
    private productsRepository;
    constructor(wishlistsRepository: Repository<Wishlist>, productsRepository: Repository<Product>);
    addToWishlist(productId: string, addToWishlistDto: AddToWishlistDto, userId: string): Promise<Wishlist>;
    getMyWishlist(userId: string, page?: number, limit?: number): Promise<{
        data: Wishlist[];
        total: number;
    }>;
    findOne(id: string, userId: string): Promise<Wishlist>;
    update(id: string, updateWishlistDto: UpdateWishlistDto, userId: string): Promise<Wishlist>;
    remove(id: string, userId: string): Promise<void>;
    removeByProduct(productId: string, userId: string): Promise<void>;
    isInWishlist(productId: string, userId: string): Promise<boolean>;
    getWishlistCount(userId: string): Promise<number>;
    getWishlistWithPriceAlerts(userId: string): Promise<Wishlist[]>;
    getWishlistBackInStock(userId: string): Promise<Wishlist[]>;
}
