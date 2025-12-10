import { Order } from './order.entity';
import { Product } from './product.entity';
export declare class OrderItem {
    id: string;
    order: Order;
    orderId: string;
    product: Product;
    productId: string;
    sellerId: string;
    quantity: number;
    price: number;
    discount: number;
    subtotal: number;
    productSnapshot: {
        name: string;
        image: string;
        sku: string;
        description: string;
        attributes?: Record<string, any>;
    };
    status: string;
    trackingNumber: string;
    shippedAt: Date;
    deliveredAt: Date;
    createdAt: Date;
}
