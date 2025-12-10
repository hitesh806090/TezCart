import {
    IsString,
    IsOptional,
    IsNumber,
    IsBoolean,
    IsUUID,
    IsArray,
    IsEnum,
    Min,
    MaxLength,
    IsObject,
    ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ProductStatus } from '../../entities/product.entity';

class DimensionsDto {
    @ApiProperty({ example: 10 })
    @IsNumber()
    @Min(0)
    length: number;

    @ApiProperty({ example: 5 })
    @IsNumber()
    @Min(0)
    width: number;

    @ApiProperty({ example: 3 })
    @IsNumber()
    @Min(0)
    height: number;

    @ApiProperty({ example: 'cm' })
    @IsString()
    unit: string;
}

export class CreateProductDto {
    @ApiProperty({ example: 'iPhone 15 Pro' })
    @IsString()
    @MaxLength(200)
    name: string;

    @ApiProperty({ example: 'Latest Apple iPhone with A17 Pro chip' })
    @IsString()
    description: string;

    @ApiPropertyOptional({ example: 'Flagship iPhone with advanced features' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    shortDescription?: string;

    @ApiProperty({ example: 999.99 })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiPropertyOptional({ example: 1099.99 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    compareAtPrice?: number;

    @ApiPropertyOptional({ example: 800.00 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    costPrice?: number;

    @ApiPropertyOptional({ example: 50 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    stockQuantity?: number;

    @ApiPropertyOptional({ example: 'IPH15PRO-BLK-256' })
    @IsOptional()
    @IsString()
    sku?: string;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    trackInventory?: boolean;

    @ApiPropertyOptional({ example: 10 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    lowStockThreshold?: number;

    @ApiPropertyOptional({
        example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

    @ApiPropertyOptional({ example: 'Apple' })
    @IsOptional()
    @IsString()
    brand?: string;

    @ApiPropertyOptional({ example: 200 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    weight?: number;

    @ApiPropertyOptional({
        example: { length: 15, width: 7.5, height: 0.8, unit: 'cm' },
    })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => DimensionsDto)
    dimensions?: DimensionsDto;

    @ApiPropertyOptional({
        example: { color: 'Black', storage: '256GB', processor: 'A17 Pro' },
    })
    @IsOptional()
    @IsObject()
    attributes?: Record<string, any>;

    @ApiPropertyOptional({ example: 'iPhone 15 Pro - Best Price' })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    metaTitle?: string;

    @ApiPropertyOptional({ example: 'Buy iPhone 15 Pro at the best price...' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    metaDescription?: string;

    @ApiPropertyOptional({ example: ['smartphone', 'apple', 'iphone'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @ApiPropertyOptional({ enum: ProductStatus, example: ProductStatus.ACTIVE })
    @IsOptional()
    @IsEnum(ProductStatus)
    status?: ProductStatus;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsUUID()
    categoryId: string;

    @ApiPropertyOptional({ example: false })
    @IsOptional()
    @IsBoolean()
    isFeatured?: boolean;
}

export class UpdateProductDto {
    @ApiPropertyOptional({ example: 'iPhone 15 Pro' })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    name?: string;

    @ApiPropertyOptional({ example: 'Latest Apple iPhone with A17 Pro chip' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ example: 'Flagship iPhone with advanced features' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    shortDescription?: string;

    @ApiPropertyOptional({ example: 999.99 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;

    @ApiPropertyOptional({ example: 1099.99 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    compareAtPrice?: number;

    @ApiPropertyOptional({ example: 800.00 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    costPrice?: number;

    @ApiPropertyOptional({ example: 50 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    stockQuantity?: number;

    @ApiPropertyOptional({ example: 'IPH15PRO-BLK-256' })
    @IsOptional()
    @IsString()
    sku?: string;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    trackInventory?: boolean;

    @ApiPropertyOptional({ example: 10 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    lowStockThreshold?: number;

    @ApiPropertyOptional({
        example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

    @ApiPropertyOptional({ example: 'Apple' })
    @IsOptional()
    @IsString()
    brand?: string;

    @ApiPropertyOptional({ example: 200 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    weight?: number;

    @ApiPropertyOptional({
        example: { length: 15, width: 7.5, height: 0.8, unit: 'cm' },
    })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => DimensionsDto)
    dimensions?: DimensionsDto;

    @ApiPropertyOptional({
        example: { color: 'Black', storage: '256GB', processor: 'A17 Pro' },
    })
    @IsOptional()
    @IsObject()
    attributes?: Record<string, any>;

    @ApiPropertyOptional({ example: 'iPhone 15 Pro - Best Price' })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    metaTitle?: string;

    @ApiPropertyOptional({ example: 'Buy iPhone 15 Pro at the best price...' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    metaDescription?: string;

    @ApiPropertyOptional({ example: ['smartphone', 'apple', 'iphone'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @ApiPropertyOptional({ enum: ProductStatus, example: ProductStatus.ACTIVE })
    @IsOptional()
    @IsEnum(ProductStatus)
    status?: ProductStatus;

    @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsOptional()
    @IsUUID()
    categoryId?: string;

    @ApiPropertyOptional({ example: false })
    @IsOptional()
    @IsBoolean()
    isFeatured?: boolean;
}

export class ProductQueryDto {
    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ example: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number = 20;

    @ApiPropertyOptional({ example: 'iphone' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsOptional()
    @IsUUID()
    categoryId?: string;

    @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsOptional()
    @IsUUID()
    sellerId?: string;

    @ApiPropertyOptional({ enum: ProductStatus, example: ProductStatus.ACTIVE })
    @IsOptional()
    @IsEnum(ProductStatus)
    status?: ProductStatus;

    @ApiPropertyOptional({ example: 'Apple' })
    @IsOptional()
    @IsString()
    brand?: string;

    @ApiPropertyOptional({ example: 100 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    minPrice?: number;

    @ApiPropertyOptional({ example: 1000 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    maxPrice?: number;

    @ApiPropertyOptional({ example: 'price' })
    @IsOptional()
    @IsString()
    sortBy?: string = 'createdAt';

    @ApiPropertyOptional({ example: 'DESC' })
    @IsOptional()
    @IsEnum(['ASC', 'DESC'])
    sortOrder?: 'ASC' | 'DESC' = 'DESC';

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    isFeatured?: boolean;
}
