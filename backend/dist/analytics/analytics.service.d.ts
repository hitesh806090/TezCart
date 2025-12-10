import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { Seller } from '../entities/seller.entity';
export declare class AnalyticsService {
    private ordersRepository;
    private productsRepository;
    private usersRepository;
    private sellersRepository;
    constructor(ordersRepository: Repository<Order>, productsRepository: Repository<Product>, usersRepository: Repository<User>, sellersRepository: Repository<Seller>);
    getAdminDashboard(dateFrom?: Date, dateTo?: Date): Promise<any>;
    getSellerDashboard(sellerId: string, dateFrom?: Date, dateTo?: Date): Promise<any>;
    private getRevenueByDay;
    private getSellerRevenueByDay;
    private getTopSellingProducts;
    private getTopSellers;
    getSalesReport(dateFrom: Date, dateTo: Date): Promise<any>;
}
