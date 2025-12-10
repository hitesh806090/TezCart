import { PaymentMethod, OrderStatus } from '../../entities/order.entity';
declare class AddressDto {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}
export declare class CreateOrderDto {
    shippingAddress: AddressDto;
    billingAddress?: AddressDto;
    paymentMethod: PaymentMethod;
    customerNotes?: string;
    couponCode?: string;
}
export declare class UpdateOrderStatusDto {
    status: OrderStatus;
    adminNotes?: string;
}
export declare class AddTrackingDto {
    trackingNumber: string;
    carrier: string;
    estimatedDeliveryDate?: string;
}
export declare class CancelOrderDto {
    reason: string;
}
export declare class OrderQueryDto {
    page?: number;
    limit?: number;
    status?: OrderStatus;
    dateFrom?: string;
    dateTo?: string;
}
export {};
