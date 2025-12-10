import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto, AddTrackingDto, CancelOrderDto, OrderQueryDto } from './dto/order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createOrder(createOrderDto: CreateOrderDto, req: any): Promise<import("../entities/order.entity").Order>;
    getMyOrders(req: any, query: OrderQueryDto): Promise<{
        data: import("../entities/order.entity").Order[];
        total: number;
        page: number;
        limit: number;
    }>;
    getSellerOrders(req: any, query: OrderQueryDto): Promise<{
        data: import("../entities/order.entity").Order[];
        total: number;
        page: number;
        limit: number;
    }>;
    getStats(req: any): Promise<any>;
    findOne(id: string): Promise<import("../entities/order.entity").Order>;
    findByOrderNumber(orderNumber: string): Promise<import("../entities/order.entity").Order>;
    updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto, req: any): Promise<import("../entities/order.entity").Order>;
    addTracking(id: string, addTrackingDto: AddTrackingDto, req: any): Promise<import("../entities/order.entity").Order>;
    cancelOrder(id: string, cancelOrderDto: CancelOrderDto, req: any): Promise<import("../entities/order.entity").Order>;
}
