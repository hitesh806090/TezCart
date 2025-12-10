import {
    IsString,
    IsOptional,
    IsInt,
    Min,
    Max,
    IsArray,
    IsBoolean,
    MaxLength,
    MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
    @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @ApiPropertyOptional({ example: 'Amazing product!' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    title?: string;

    @ApiProperty({ example: 'This product exceeded my expectations. Highly recommended!' })
    @IsString()
    @MinLength(10)
    @MaxLength(2000)
    comment: string;

    @ApiPropertyOptional({
        example: ['https://example.com/review-image1.jpg', 'https://example.com/review-image2.jpg'],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];
}

export class UpdateReviewDto {
    @ApiPropertyOptional({ example: 5, minimum: 1, maximum: 5 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    rating?: number;

    @ApiPropertyOptional({ example: 'Amazing product!' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    title?: string;

    @ApiPropertyOptional({ example: 'This product exceeded my expectations. Highly recommended!' })
    @IsOptional()
    @IsString()
    @MinLength(10)
    @MaxLength(2000)
    comment?: string;

    @ApiPropertyOptional({
        example: ['https://example.com/review-image1.jpg', 'https://example.com/review-image2.jpg'],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];
}

export class SellerResponseDto {
    @ApiProperty({ example: 'Thank you for your feedback! We appreciate your support.' })
    @IsString()
    @MinLength(10)
    @MaxLength(1000)
    response: string;
}

export class VoteReviewDto {
    @ApiProperty({ example: true, description: 'true = helpful, false = not helpful' })
    @IsBoolean()
    isHelpful: boolean;
}

export class ReviewQueryDto {
    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ example: 20 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 20;

    @ApiPropertyOptional({ example: 5, minimum: 1, maximum: 5 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    rating?: number;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    verifiedPurchaseOnly?: boolean;

    @ApiPropertyOptional({ example: 'helpful', enum: ['helpful', 'recent', 'rating_high', 'rating_low'] })
    @IsOptional()
    @IsString()
    sortBy?: 'helpful' | 'recent' | 'rating_high' | 'rating_low' = 'helpful';
}
