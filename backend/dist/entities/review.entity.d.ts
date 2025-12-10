import { User } from './user.entity';
import { Product } from './product.entity';
export declare class Review {
    id: string;
    user: User;
    userId: string;
    product: Product;
    productId: string;
    rating: number;
    title: string;
    comment: string;
    images: string[];
    isVerifiedPurchase: boolean;
    helpfulCount: number;
    notHelpfulCount: number;
    isApproved: boolean;
    isFeatured: boolean;
    sellerResponse: string;
    sellerResponseDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
