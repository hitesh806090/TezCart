import { Order } from './order.entity';
import { User } from './user.entity';
export declare enum PaymentMethod {
    CREDIT_CARD = "credit_card",
    DEBIT_CARD = "debit_card",
    UPI = "upi",
    NET_BANKING = "net_banking",
    WALLET = "wallet",
    COD = "cod"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed",
    REFUNDED = "refunded",
    PARTIALLY_REFUNDED = "partially_refunded"
}
export declare enum PaymentGateway {
    STRIPE = "stripe",
    RAZORPAY = "razorpay",
    PAYPAL = "paypal",
    MANUAL = "manual"
}
export declare class Payment {
    id: string;
    order: Order;
    orderId: string;
    user: User;
    userId: string;
    paymentMethod: PaymentMethod;
    gateway: PaymentGateway;
    status: PaymentStatus;
    amount: number;
    currency: string;
    transactionId: string;
    gatewayOrderId: string;
    gatewayResponse: any;
    cardLast4: string;
    cardBrand: string;
    refundedAmount: number;
    refundReason: string;
    refundedAt: Date;
    failureReason: string;
    failureCode: string;
    paidAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
