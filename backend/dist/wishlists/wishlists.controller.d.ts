import { WishlistsService } from './wishlists.service';
import { AddToWishlistDto, UpdateWishlistDto } from './dto/wishlist.dto';
export declare class WishlistsController {
    private readonly wishlistsService;
    constructor(wishlistsService: WishlistsService);
    addToWishlist(productId: string, addToWishlistDto: AddToWishlistDto, req: any): Promise<import("../entities/wishlist.entity").Wishlist>;
    getMyWishlist(req: any, page?: string, limit?: string): Promise<{
        data: import("../entities/wishlist.entity").Wishlist[];
        total: number;
    }>;
    getWishlistCount(req: any): Promise<number>;
    getWishlistWithPriceAlerts(req: any): Promise<import("../entities/wishlist.entity").Wishlist[]>;
    getWishlistBackInStock(req: any): Promise<import("../entities/wishlist.entity").Wishlist[]>;
    checkInWishlist(productId: string, req: any): Promise<{
        isInWishlist: boolean;
    }>;
    findOne(id: string, req: any): Promise<import("../entities/wishlist.entity").Wishlist>;
    update(id: string, updateWishlistDto: UpdateWishlistDto, req: any): Promise<import("../entities/wishlist.entity").Wishlist>;
    remove(id: string, req: any): Promise<void>;
    removeByProduct(productId: string, req: any): Promise<void>;
}
