import { User } from './user.entity';
import { CartItem } from './cart-item.entity';
export declare enum CartStatus {
    ACTIVE = "active",
    ABANDONED = "abandoned",
    CONVERTED = "converted"
}
export declare class Cart {
    id: string;
    user: User;
    userId: string;
    sessionId: string;
    items: CartItem[];
    status: CartStatus;
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
    itemCount: number;
    couponCode: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
