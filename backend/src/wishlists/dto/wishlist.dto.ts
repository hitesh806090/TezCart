import {
    IsString,
    IsOptional,
    IsBoolean,
    IsNumber,
    Min,
    MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddToWishlistDto {
    @ApiPropertyOptional({ example: 'Want to buy this for my birthday' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    note?: string;

    @ApiPropertyOptional({ example: 799.99 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    desiredPrice?: number;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    notifyOnPriceChange?: boolean;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    notifyOnBackInStock?: boolean;
}

export class UpdateWishlistDto {
    @ApiPropertyOptional({ example: 'Want to buy this for my birthday' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    note?: string;

    @ApiPropertyOptional({ example: 799.99 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    desiredPrice?: number;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    notifyOnPriceChange?: boolean;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    notifyOnBackInStock?: boolean;
}
