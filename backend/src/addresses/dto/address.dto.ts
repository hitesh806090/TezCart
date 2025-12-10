import {
    IsString,
    IsOptional,
    IsEnum,
    IsBoolean,
    MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AddressType } from '../../entities/address.entity';

export class CreateAddressDto {
    @ApiProperty({ enum: AddressType, example: AddressType.HOME })
    @IsEnum(AddressType)
    type: AddressType;

    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @MaxLength(100)
    fullName: string;

    @ApiProperty({ example: '+1234567890' })
    @IsString()
    @MaxLength(20)
    phone: string;

    @ApiProperty({ example: '123 Main Street' })
    @IsString()
    @MaxLength(200)
    addressLine1: string;

    @ApiPropertyOptional({ example: 'Apt 4B' })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    addressLine2?: string;

    @ApiProperty({ example: 'New York' })
    @IsString()
    @MaxLength(100)
    city: string;

    @ApiProperty({ example: 'NY' })
    @IsString()
    @MaxLength(100)
    state: string;

    @ApiProperty({ example: '10001' })
    @IsString()
    @MaxLength(20)
    postalCode: string;

    @ApiProperty({ example: 'USA' })
    @IsString()
    @MaxLength(100)
    country: string;

    @ApiPropertyOptional({ example: false })
    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;

    @ApiPropertyOptional({ example: 'Leave at door' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    instructions?: string;
}

export class UpdateAddressDto {
    @ApiPropertyOptional({ enum: AddressType, example: AddressType.HOME })
    @IsOptional()
    @IsEnum(AddressType)
    type?: AddressType;

    @ApiPropertyOptional({ example: 'John Doe' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    fullName?: string;

    @ApiPropertyOptional({ example: '+1234567890' })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    phone?: string;

    @ApiPropertyOptional({ example: '123 Main Street' })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    addressLine1?: string;

    @ApiPropertyOptional({ example: 'Apt 4B' })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    addressLine2?: string;

    @ApiPropertyOptional({ example: 'New York' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    city?: string;

    @ApiPropertyOptional({ example: 'NY' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    state?: string;

    @ApiPropertyOptional({ example: '10001' })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    postalCode?: string;

    @ApiPropertyOptional({ example: 'USA' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    country?: string;

    @ApiPropertyOptional({ example: false })
    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;

    @ApiPropertyOptional({ example: 'Leave at door' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    instructions?: string;
}
