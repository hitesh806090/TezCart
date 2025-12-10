import { User } from './user.entity';
import { OrderItem } from './order-item.entity';
export declare enum OrderStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
    REFUNDED = "refunded"
}
export declare enum PaymentMethod {
    CREDIT_CARD = "credit_card",
    DEBIT_CARD = "debit_card",
    UPI = "upi",
    NET_BANKING = "net_banking",
    WALLET = "wallet",
    COD = "cod"
}
export declare class Order {
    id: string;
    orderNumber: string;
    user: User;
    userId: string;
    items: OrderItem[];
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    paymentTransactionId: string;
    paidAt: Date;
    subtotal: number;
    tax: number;
    shippingCost: number;
    discount: number;
    totalAmount: number;
    shippingAddress: {
        fullName: string;
        phone: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    billingAddress: {
        fullName: string;
        phone: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    couponCode: string;
    trackingNumber: string;
    carrier: string;
    estimatedDeliveryDate: Date;
    deliveredAt: Date;
    customerNotes: string;
    adminNotes: string;
    cancellationReason: string;
    cancelledAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
