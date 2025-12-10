import {
    IsString,
    IsOptional,
    IsEnum,
    IsObject,
    ValidateNested,
    IsInt,
    Min,
    MaxLength,
    IsPhoneNumber,
    IsPostalCode,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaymentMethod, OrderStatus } from '../../entities/order.entity';

class AddressDto {
    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @MaxLength(100)
    fullName: string;

    @ApiProperty({ example: '+1234567890' })
    @IsString()
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
    postalCode: string;

    @ApiProperty({ example: 'USA' })
    @IsString()
    @MaxLength(100)
    country: string;
}

export class CreateOrderDto {
    @ApiProperty({ type: AddressDto })
    @IsObject()
    @ValidateNested()
    @Type(() => AddressDto)
    shippingAddress: AddressDto;

    @ApiPropertyOptional({ type: AddressDto })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => AddressDto)
    billingAddress?: AddressDto;

    @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CREDIT_CARD })
    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;

    @ApiPropertyOptional({ example: 'Please deliver before 5 PM' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    customerNotes?: string;

    @ApiPropertyOptional({ example: 'SAVE20' })
    @IsOptional()
    @IsString()
    couponCode?: string;
}

export class UpdateOrderStatusDto {
    @ApiProperty({ enum: OrderStatus, example: OrderStatus.PROCESSING })
    @IsEnum(OrderStatus)
    status: OrderStatus;

    @ApiPropertyOptional({ example: 'Order is being packed' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    adminNotes?: string;
}

export class AddTrackingDto {
    @ApiProperty({ example: '1Z999AA10123456784' })
    @IsString()
    trackingNumber: string;

    @ApiProperty({ example: 'FedEx' })
    @IsString()
    carrier: string;

    @ApiPropertyOptional({ example: '2025-12-15T10:00:00Z' })
    @IsOptional()
    @IsString()
    estimatedDeliveryDate?: string;
}

export class CancelOrderDto {
    @ApiProperty({ example: 'Changed my mind' })
    @IsString()
    @MaxLength(500)
    reason: string;
}

export class OrderQueryDto {
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
    limit?: number = 20;

    @ApiPropertyOptional({ enum: OrderStatus })
    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus;

    @ApiPropertyOptional({ example: '2025-01-01' })
    @IsOptional()
    @IsString()
    dateFrom?: string;

    @ApiPropertyOptional({ example: '2025-12-31' })
    @IsOptional()
    @IsString()
    dateTo?: string;
}
