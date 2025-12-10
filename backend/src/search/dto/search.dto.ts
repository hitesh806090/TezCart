import {
    IsString,
    IsOptional,
    IsNumber,
    IsEnum,
    IsInt,
    Min,
    Max,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum SearchType {
    PRODUCTS = 'products',
    CATEGORIES = 'categories',
    ALL = 'all',
}

export enum SortOption {
    RELEVANCE = 'relevance',
    PRICE_LOW = 'price_low',
    PRICE_HIGH = 'price_high',
    NEWEST = 'newest',
    RATING = 'rating',
    POPULAR = 'popular',
}

export class SearchQueryDto {
    @ApiPropertyOptional({ example: 'laptop' })
    @IsOptional()
    @IsString()
    q?: string; // Search query

    @ApiPropertyOptional({ enum: SearchType, default: SearchType.ALL })
    @IsOptional()
    @IsEnum(SearchType)
    type?: SearchType = SearchType.ALL;

    @ApiPropertyOptional({ example: 'category-uuid' })
    @IsOptional()
    @IsString()
    categoryId?: string;

    @ApiPropertyOptional({ example: 0 })
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

    @ApiPropertyOptional({ example: 'Apple' })
    @IsOptional()
    @IsString()
    brand?: string;

    @ApiPropertyOptional({ example: 4 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(5)
    minRating?: number;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    inStock?: boolean;

    @ApiPropertyOptional({ enum: SortOption, default: SortOption.RELEVANCE })
    @IsOptional()
    @IsEnum(SortOption)
    sortBy?: SortOption = SortOption.RELEVANCE;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ example: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 20;
}

export class SearchSuggestionsDto {
    @ApiPropertyOptional({ example: 'lap' })
    @IsOptional()
    @IsString()
    q?: string;

    @ApiPropertyOptional({ example: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(20)
    limit?: number = 10;
}
