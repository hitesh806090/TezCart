import { ProductStatus } from '../../entities/product.entity';
declare class DimensionsDto {
    length: number;
    width: number;
    height: number;
    unit: string;
}
export declare class CreateProductDto {
    name: string;
    description: string;
    shortDescription?: string;
    price: number;
    compareAtPrice?: number;
    costPrice?: number;
    stockQuantity?: number;
    sku?: string;
    trackInventory?: boolean;
    lowStockThreshold?: number;
    images?: string[];
    brand?: string;
    weight?: number;
    dimensions?: DimensionsDto;
    attributes?: Record<string, any>;
    metaTitle?: string;
    metaDescription?: string;
    tags?: string[];
    status?: ProductStatus;
    categoryId: string;
    isFeatured?: boolean;
}
export declare class UpdateProductDto {
    name?: string;
    description?: string;
    shortDescription?: string;
    price?: number;
    compareAtPrice?: number;
    costPrice?: number;
    stockQuantity?: number;
    sku?: string;
    trackInventory?: boolean;
    lowStockThreshold?: number;
    images?: string[];
    brand?: string;
    weight?: number;
    dimensions?: DimensionsDto;
    attributes?: Record<string, any>;
    metaTitle?: string;
    metaDescription?: string;
    tags?: string[];
    status?: ProductStatus;
    categoryId?: string;
    isFeatured?: boolean;
}
export declare class ProductQueryDto {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    sellerId?: string;
    status?: ProductStatus;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    isFeatured?: boolean;
}
export {};
