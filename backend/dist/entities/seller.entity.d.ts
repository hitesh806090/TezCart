import { User } from './user.entity';
export declare enum SellerStatus {
    PENDING = "pending",
    APPROVED = "approved",
    SUSPENDED = "suspended",
    REJECTED = "rejected"
}
export declare enum SellerTier {
    BRONZE = "bronze",
    SILVER = "silver",
    GOLD = "gold",
    PLATINUM = "platinum"
}
export declare class Seller {
    id: string;
    user: User;
    userId: string;
    shopName: string;
    shopSlug: string;
    description: string;
    logo: string;
    banner: string;
    businessName: string;
    businessAddress: string;
    businessPhone: string;
    businessEmail: string;
    taxId: string;
    gstNumber: string;
    bankDetails: {
        accountHolder: string;
        accountNumber: string;
        bankName: string;
        ifscCode: string;
        branch: string;
    };
    rating: number;
    totalReviews: number;
    totalProducts: number;
    totalSales: number;
    totalRevenue: number;
    tier: SellerTier;
    status: SellerStatus;
    isActive: boolean;
    commissionRate: number;
    rejectionReason: string;
    approvedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
