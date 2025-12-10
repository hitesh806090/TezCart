import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Cart } from '../entities/cart.entity';
import { Product } from '../entities/product.entity';
import { CreateOrderDto, UpdateOrderStatusDto, AddTrackingDto, CancelOrderDto, OrderQueryDto } from './dto/order.dto';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';
export declare class OrdersService {
    private ordersRepository;
    private orderItemsRepository;
    private cartsRepository;
    private productsRepository;
    private cartService;
    private productsService;
    constructor(ordersRepository: Repository<Order>, orderItemsRepository: Repository<OrderItem>, cartsRepository: Repository<Cart>, productsRepository: Repository<Product>, cartService: CartService, productsService: ProductsService);
    private generateOrderNumber;
    createOrder(createOrderDto: CreateOrderDto, userId: string): Promise<Order>;
    findAll(query: OrderQueryDto, userId?: string, sellerId?: string): Promise<{
        data: Order[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<Order>;
    findByOrderNumber(orderNumber: string): Promise<Order>;
    updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto, userRole: string): Promise<Order>;
    addTracking(id: string, addTrackingDto: AddTrackingDto, userRole: string): Promise<Order>;
    cancelOrder(id: string, cancelOrderDto: CancelOrderDto, userId: string, userRole: string): Promise<Order>;
    getMyOrders(userId: string, query: OrderQueryDto): Promise<{
        data: Order[];
        total: number;
        page: number;
        limit: number;
    }>;
    getSellerOrders(sellerId: string, query: OrderQueryDto): Promise<{
        data: Order[];
        total: number;
        page: number;
        limit: number;
    }>;
    getOrderStats(userId?: string, sellerId?: string): Promise<any>;
}
