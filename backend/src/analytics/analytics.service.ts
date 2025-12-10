import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Order, OrderStatus } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { Seller } from '../entities/seller.entity';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Seller)
        private sellersRepository: Repository<Seller>,
    ) { }

    async getAdminDashboard(dateFrom?: Date, dateTo?: Date): Promise<any> {
        const fromDate = dateFrom || new Date(new Date().setDate(new Date().getDate() - 30));
        const toDate = dateTo || new Date();

        // Orders
        const orders = await this.ordersRepository.find({
            where: {
                createdAt: Between(fromDate, toDate),
            },
        });

        const totalOrders = orders.length;
        const completedOrders = orders.filter(o => o.status === OrderStatus.DELIVERED).length;
        const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING).length;
        const cancelledOrders = orders.filter(o => o.status === OrderStatus.CANCELLED).length;

        // Revenue
        const totalRevenue = orders
            .filter(o => o.status !== OrderStatus.CANCELLED)
            .reduce((sum, o) => sum + Number(o.totalAmount), 0);

        const completedRevenue = orders
            .filter(o => o.status === OrderStatus.DELIVERED)
            .reduce((sum, o) => sum + Number(o.totalAmount), 0);

        // Products
        const totalProducts = await this.productsRepository.count();
        const activeProducts = await this.productsRepository.count({
            where: { status: 'active' as any },
        });

        // Users
        const totalUsers = await this.usersRepository.count();
        const newUsers = await this.usersRepository.count({
            where: {
                createdAt: Between(fromDate, toDate),
            },
        });

        // Sellers
        const totalSellers = await this.sellersRepository.count();
        const approvedSellers = await this.sellersRepository.count({
            where: { status: 'approved' as any },
        });
        const pendingSellers = await this.sellersRepository.count({
            where: { status: 'pending' as any },
        });

        // Revenue by day (for chart)
        const revenueByDay = await this.getRevenueByDay(fromDate, toDate);

        // Top selling products
        const topProducts = await this.getTopSellingProducts(10);

        // Top sellers
        const topSellers = await this.getTopSellers(10);

        return {
            overview: {
                totalOrders,
                completedOrders,
                pendingOrders,
                cancelledOrders,
                totalRevenue: Math.round(totalRevenue * 100) / 100,
                completedRevenue: Math.round(completedRevenue * 100) / 100,
                averageOrderValue: totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0,
                totalProducts,
                activeProducts,
                totalUsers,
                newUsers,
                totalSellers,
                approvedSellers,
                pendingSellers,
            },
            charts: {
                revenueByDay,
                ordersByStatus: [
                    { status: 'Completed', count: completedOrders },
                    { status: 'Pending', count: pendingOrders },
                    { status: 'Cancelled', count: cancelledOrders },
                ],
            },
            topProducts,
            topSellers,
        };
    }

    async getSellerDashboard(sellerId: string, dateFrom?: Date, dateTo?: Date): Promise<any> {
        const fromDate = dateFrom || new Date(new Date().setDate(new Date().getDate() - 30));
        const toDate = dateTo || new Date();

        const seller = await this.sellersRepository.findOne({ where: { userId: sellerId } });

        if (!seller) {
            return null;
        }

        // Get seller's orders
        const orders = await this.ordersRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.items', 'items')
            .where('items.sellerId = :sellerId', { sellerId })
            .andWhere('order.createdAt BETWEEN :fromDate AND :toDate', { fromDate, toDate })
            .getMany();

        const totalOrders = orders.length;
        const completedOrders = orders.filter(o => o.status === OrderStatus.DELIVERED).length;
        const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING).length;

        const totalRevenue = orders
            .filter(o => o.status !== OrderStatus.CANCELLED)
            .reduce((sum, o) => sum + Number(o.totalAmount), 0);

        // Products
        const products = await this.productsRepository.find({
            where: { sellerId },
        });

        const totalProducts = products.length;
        const activeProducts = products.filter(p => p.status === 'active').length;
        const outOfStock = products.filter(p => p.stockQuantity === 0).length;

        // Revenue by day
        const revenueByDay = await this.getSellerRevenueByDay(sellerId, fromDate, toDate);

        // Top selling products for this seller
        const topProducts = products
            .sort((a, b) => b.totalSales - a.totalSales)
            .slice(0, 10)
            .map(p => ({
                id: p.id,
                name: p.name,
                sales: p.totalSales,
                revenue: Math.round(Number(p.price) * p.totalSales * 100) / 100,
                stock: p.stockQuantity,
            }));

        return {
            seller: {
                shopName: seller.shopName,
                rating: seller.rating,
                tier: seller.tier,
            },
            overview: {
                totalOrders,
                completedOrders,
                pendingOrders,
                totalRevenue: Math.round(totalRevenue * 100) / 100,
                averageOrderValue: totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0,
                totalProducts,
                activeProducts,
                outOfStock,
            },
            charts: {
                revenueByDay,
            },
            topProducts,
        };
    }

    private async getRevenueByDay(fromDate: Date, toDate: Date): Promise<any[]> {
        const orders = await this.ordersRepository.find({
            where: {
                createdAt: Between(fromDate, toDate),
                status: OrderStatus.DELIVERED,
            },
        });

        const revenueMap = new Map<string, number>();

        orders.forEach(order => {
            const date = order.createdAt.toISOString().split('T')[0];
            const current = revenueMap.get(date) || 0;
            revenueMap.set(date, current + Number(order.totalAmount));
        });

        return Array.from(revenueMap.entries())
            .map(([date, revenue]) => ({
                date,
                revenue: Math.round(revenue * 100) / 100,
            }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }

    private async getSellerRevenueByDay(sellerId: string, fromDate: Date, toDate: Date): Promise<any[]> {
        const orders = await this.ordersRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.items', 'items')
            .where('items.sellerId = :sellerId', { sellerId })
            .andWhere('order.createdAt BETWEEN :fromDate AND :toDate', { fromDate, toDate })
            .andWhere('order.status = :status', { status: OrderStatus.DELIVERED })
            .getMany();

        const revenueMap = new Map<string, number>();

        orders.forEach(order => {
            const date = order.createdAt.toISOString().split('T')[0];
            const current = revenueMap.get(date) || 0;
            revenueMap.set(date, current + Number(order.totalAmount));
        });

        return Array.from(revenueMap.entries())
            .map(([date, revenue]) => ({
                date,
                revenue: Math.round(revenue * 100) / 100,
            }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }

    private async getTopSellingProducts(limit: number = 10): Promise<any[]> {
        const products = await this.productsRepository.find({
            order: { totalSales: 'DESC' },
            take: limit,
        });

        return products.map(p => ({
            id: p.id,
            name: p.name,
            sales: p.totalSales,
            revenue: Math.round(Number(p.price) * p.totalSales * 100) / 100,
            rating: p.averageRating,
        }));
    }

    private async getTopSellers(limit: number = 10): Promise<any[]> {
        const sellers = await this.sellersRepository.find({
            where: { status: 'approved' as any },
            order: { totalRevenue: 'DESC' },
            take: limit,
        });

        return sellers.map(s => ({
            id: s.id,
            shopName: s.shopName,
            totalSales: s.totalSales,
            totalRevenue: Math.round(Number(s.totalRevenue) * 100) / 100,
            rating: s.rating,
            tier: s.tier,
        }));
    }

    async getSalesReport(dateFrom: Date, dateTo: Date): Promise<any> {
        const orders = await this.ordersRepository.find({
            where: {
                createdAt: Between(dateFrom, dateTo),
            },
            relations: ['items'],
        });

        const totalOrders = orders.length;
        const totalRevenue = orders
            .filter(o => o.status !== OrderStatus.CANCELLED)
            .reduce((sum, o) => sum + Number(o.totalAmount), 0);

        const totalItemsSold = orders.reduce((sum, o) =>
            sum + o.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

        return {
            period: {
                from: dateFrom,
                to: dateTo,
            },
            summary: {
                totalOrders,
                totalRevenue: Math.round(totalRevenue * 100) / 100,
                totalItemsSold,
                averageOrderValue: totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0,
            },
            orders: orders.map(o => ({
                orderNumber: o.orderNumber,
                date: o.createdAt,
                status: o.status,
                total: Number(o.totalAmount),
                itemCount: o.items.length,
            })),
        };
    }
}
