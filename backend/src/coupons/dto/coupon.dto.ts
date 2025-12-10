import {
    IsString,
    IsEnum,
    IsNumber,
    IsOptional,
    IsBoolean,
    IsArray,
    IsDateString,
    Min,
    Max,
    MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DiscountType, CouponStatus } from '../../entities/coupon.entity';

export class CreateCouponDto {
    @ApiProperty({ example: 'SAVE20' })
    @IsString()
    @MaxLength(50)
    code: string;

    @ApiPropertyOptional({ example: 'Save 20% on all orders' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @ApiProperty({ enum: DiscountType, example: DiscountType.PERCENTAGE })
    @IsEnum(DiscountType)
    discountType: DiscountType;

    @ApiProperty({ example: 20 })
    @IsNumber()
    @Min(0)
    discountValue: number;

    @ApiPropertyOptional({ example: 50 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    minOrderAmount?: number;

    @ApiPropertyOptional({ example: 100 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    maxDiscountAmount?: number;

    @ApiPropertyOptional({ example: 100 })
    @IsOptional()
    @IsNumber()
    @Min(1)
    maxTotalUses?: number;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsNumber()
    @Min(1)
    maxUsesPerUser?: number;

    @ApiProperty({ example: '2025-01-01T00:00:00Z' })
    @IsDateString()
    validFrom: string;

    @ApiProperty({ example: '2025-12-31T23:59:59Z' })
    @IsDateString()
    validUntil: string;

    @ApiPropertyOptional({ example: ['category-id-1', 'category-id-2'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    applicableCategories?: string[];

    @ApiPropertyOptional({ example: ['product-id-1', 'product-id-2'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    applicableProducts?: string[];

    @ApiPropertyOptional({ example: ['product-id-3'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    excludedProducts?: string[];

    @ApiPropertyOptional({ example: false })
    @IsOptional()
    @IsBoolean()
    isFirstOrderOnly?: boolean;
}

export class UpdateCouponDto {
    @ApiPropertyOptional({ example: 'Updated description' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @ApiPropertyOptional({ enum: CouponStatus })
    @IsOptional()
    @IsEnum(CouponStatus)
    status?: CouponStatus;

    @ApiPropertyOptional({ example: 100 })
    @IsOptional()
    @IsNumber()
    @Min(1)
    maxTotalUses?: number;

    @ApiPropertyOptional({ example: '2025-12-31T23:59:59Z' })
    @IsOptional()
    @IsDateString()
    validUntil?: string;
}

export class ValidateCouponDto {
    @ApiProperty({ example: 'SAVE20' })
    @IsString()
    code: string;

    @ApiPropertyOptional({ example: 150.00 })
    @IsOptional()
    @IsNumber()
    orderAmount?: number;
}
