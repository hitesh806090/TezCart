import {
    IsUUID,
    IsInt,
    Min,
    Max,
    IsOptional,
    IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddToCartDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsUUID()
    productId: string;

    @ApiProperty({ example: 2, minimum: 1, maximum: 100 })
    @IsInt()
    @Min(1)
    @Max(100)
    quantity: number;
}

export class UpdateCartItemDto {
    @ApiProperty({ example: 3, minimum: 1, maximum: 100 })
    @IsInt()
    @Min(1)
    @Max(100)
    quantity: number;
}

export class ApplyCouponDto {
    @ApiProperty({ example: 'SAVE20' })
    @IsString()
    couponCode: string;
}

export class MergeCartDto {
    @ApiPropertyOptional({ example: 'guest-session-uuid' })
    @IsOptional()
    @IsString()
    sessionId?: string;
}
