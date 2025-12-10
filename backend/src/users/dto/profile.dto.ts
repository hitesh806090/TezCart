import {
    IsString,
    IsEmail,
    IsOptional,
    MinLength,
    MaxLength,
    IsPhoneNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
    @ApiPropertyOptional({ example: 'John Doe' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    name?: string;

    @ApiPropertyOptional({ example: 'john@example.com' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ example: '+1234567890' })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
    @IsOptional()
    @IsString()
    avatar?: string;
}

export class ChangePasswordDto {
    @ApiProperty({ example: 'currentPassword123' })
    @IsString()
    @MinLength(6)
    currentPassword: string;

    @ApiProperty({ example: 'newPassword123' })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    newPassword: string;
}

export class UpdatePreferencesDto {
    @ApiPropertyOptional({ example: true })
    @IsOptional()
    emailNotifications?: boolean;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    smsNotifications?: boolean;

    @ApiPropertyOptional({ example: false })
    @IsOptional()
    pushNotifications?: boolean;

    @ApiPropertyOptional({ example: 'en' })
    @IsOptional()
    @IsString()
    language?: string;

    @ApiPropertyOptional({ example: 'USD' })
    @IsOptional()
    @IsString()
    currency?: string;
}
