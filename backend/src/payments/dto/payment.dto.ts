import {
    IsString,
    IsEnum,
    IsNumber,
    IsOptional,
    Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '../../entities/payment.entity';

export class CreatePaymentDto {
    @ApiProperty({ example: 'order-uuid' })
    @IsString()
    orderId: string;

    @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CREDIT_CARD })
    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;

    @ApiPropertyOptional({ example: 'Return URL after payment' })
    @IsOptional()
    @IsString()
    returnUrl?: string;
}

export class ProcessPaymentDto {
    @ApiProperty({ example: 'payment-uuid' })
    @IsString()
    paymentId: string;

    @ApiPropertyOptional({ example: 'Gateway transaction ID' })
    @IsOptional()
    @IsString()
    transactionId?: string;

    @ApiPropertyOptional({ example: 'Additional payment data' })
    @IsOptional()
    gatewayData?: any;
}

export class RefundPaymentDto {
    @ApiProperty({ example: 100.00 })
    @IsNumber()
    @Min(0)
    amount: number;

    @ApiProperty({ example: 'Customer requested refund' })
    @IsString()
    reason: string;
}
