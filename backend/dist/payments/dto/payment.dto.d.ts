import { PaymentMethod } from '../../entities/payment.entity';
export declare class CreatePaymentDto {
    orderId: string;
    paymentMethod: PaymentMethod;
    returnUrl?: string;
}
export declare class ProcessPaymentDto {
    paymentId: string;
    transactionId?: string;
    gatewayData?: any;
}
export declare class RefundPaymentDto {
    amount: number;
    reason: string;
}
