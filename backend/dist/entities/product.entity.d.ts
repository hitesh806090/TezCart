import { User } from './user.entity';
import { Category } from './category.entity';
export declare enum ProductStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    INACTIVE = "inactive",
    OUT_OF_STOCK = "out_of_stock"
}
export declare class Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    price: number;
    compareAtPrice: number;
    costPrice: number;
    stockQuantity: number;
    sku: string;
    trackInventory: boolean;
    lowStockThreshold: number;
    images: string[];
    brand: string;
    weight: number;
    dimensions: {
        length: number;
        width: number;
        height: number;
        unit: string;
    };
    attributes: Record<string, any>;
    metaTitle: string;
    metaDescription: string;
    tags: string[];
    status: ProductStatus;
    seller: User;
    sellerId: string;
    category: Category;
    categoryId: string;
    averageRating: number;
    totalReviews: number;
    totalSales: number;
    viewCount: number;
    isActive: boolean;
    isFeatured: boolean;
    createdAt: Date;
    updatedAt: Date;
}
