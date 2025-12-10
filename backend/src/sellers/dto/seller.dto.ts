import {
    IsString,
    IsEmail,
    IsOptional,
    MinLength,
    MaxLength,
    IsObject,
    ValidateNested,
    IsNumber,
    Min,
    Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class BankDetailsDto {
    @ApiProperty({ example: 'John Doe' })
    @IsString()
    accountHolder: string;

    @ApiProperty({ example: '1234567890' })
    @IsString()
    accountNumber: string;

    @ApiProperty({ example: 'State Bank of India' })
    @IsString()
    bankName: string;

    @ApiProperty({ example: 'SBIN0001234' })
    @IsString()
    ifscCode: string;

    @ApiProperty({ example: 'Main Branch' })
    @IsString()
    branch: string;
}

export class CreateSellerDto {
    @ApiProperty({ example: 'TechStore' })
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    shopName: string;

    @ApiPropertyOptional({ example: 'Your one-stop shop for electronics' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @ApiProperty({ example: 'TechStore Pvt Ltd' })
    @IsString()
    businessName: string;

    @ApiProperty({ example: '123 Business Street, City' })
    @IsString()
    businessAddress: string;

    @ApiProperty({ example: '+1234567890' })
    @IsString()
    businessPhone: string;

    @ApiProperty({ example: 'business@techstore.com' })
    @IsEmail()
    businessEmail: string;

    @ApiPropertyOptional({ example: 'TAX123456' })
    @IsOptional()
    @IsString()
    taxId?: string;

    @ApiPropertyOptional({ example: '29XXXXX1234X1Z5' })
    @IsOptional()
    @IsString()
    gstNumber?: string;

    @ApiPropertyOptional({ type: BankDetailsDto })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => BankDetailsDto)
    bankDetails?: BankDetailsDto;
}

export class UpdateSellerDto {
    @ApiPropertyOptional({ example: 'TechStore Updated' })
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    shopName?: string;

    @ApiPropertyOptional({ example: 'Updated description' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    logo?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    banner?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    businessAddress?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    businessPhone?: string;

    @ApiPropertyOptional({ type: BankDetailsDto })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => BankDetailsDto)
    bankDetails?: BankDetailsDto;
}

export class ApproveSellerDto {
    @ApiPropertyOptional({ example: 10 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    commissionRate?: number;
}

export class RejectSellerDto {
    @ApiProperty({ example: 'Incomplete business documentation' })
    @IsString()
    @MinLength(10)
    reason: string;
}
