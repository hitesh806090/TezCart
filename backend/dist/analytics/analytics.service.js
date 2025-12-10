"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../entities/order.entity");
const product_entity_1 = require("../entities/product.entity");
const user_entity_1 = require("../entities/user.entity");
const seller_entity_1 = require("../entities/seller.entity");
let AnalyticsService = class AnalyticsService {
    ordersRepository;
    productsRepository;
    usersRepository;
    sellersRepository;
    constructor(ordersRepository, productsRepository, usersRepository, sellersRepository) {
        this.ordersRepository = ordersRepository;
        this.productsRepository = productsRepository;
        this.usersRepository = usersRepository;
        this.sellersRepository = sellersRepository;
    }
    async getAdminDashboard(dateFrom, dateTo) {
        const fromDate = dateFrom || new Date(new Date().setDate(new Date().getDate() - 30));
        const toDate = dateTo || new Date();
        const orders = await this.ordersRepository.find({
            where: {
                createdAt: (0, typeorm_2.Between)(fromDate, toDate),
            },
        });
        const totalOrders = orders.length;
        const completedOrders = orders.filter(o => o.status === order_entity_1.OrderStatus.DELIVERED).length;
        const pendingOrders = orders.filter(o => o.status === order_entity_1.OrderStatus.PENDING).length;
        const cancelledOrders = orders.filter(o => o.status === order_entity_1.OrderStatus.CANCELLED).length;
        const totalRevenue = orders
            .filter(o => o.status !== order_entity_1.OrderStatus.CANCELLED)
            .reduce((sum, o) => sum + Number(o.totalAmount), 0);
        const completedRevenue = orders
            .filter(o => o.status === order_entity_1.OrderStatus.DELIVERED)
            .reduce((sum, o) => sum + Number(o.totalAmount), 0);
        const totalProducts = await this.productsRepository.count();
        const activeProducts = await this.productsRepository.count({
            where: { status: 'active' },
        });
        const totalUsers = await this.usersRepository.count();
        const newUsers = await this.usersRepository.count({
            where: {
                createdAt: (0, typeorm_2.Between)(fromDate, toDate),
            },
        });
        const totalSellers = await this.sellersRepository.count();
        const approvedSellers = await this.sellersRepository.count({
            where: { status: 'approved' },
        });
        const pendingSellers = await this.sellersRepository.count({
            where: { status: 'pending' },
        });
        const revenueByDay = await this.getRevenueByDay(fromDate, toDate);
        const topProducts = await this.getTopSellingProducts(10);
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
    async getSellerDashboard(sellerId, dateFrom, dateTo) {
        const fromDate = dateFrom || new Date(new Date().setDate(new Date().getDate() - 30));
        const toDate = dateTo || new Date();
        const seller = await this.sellersRepository.findOne({ where: { userId: sellerId } });
        if (!seller) {
            return null;
        }
        const orders = await this.ordersRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.items', 'items')
            .where('items.sellerId = :sellerId', { sellerId })
            .andWhere('order.createdAt BETWEEN :fromDate AND :toDate', { fromDate, toDate })
            .getMany();
        const totalOrders = orders.length;
        const completedOrders = orders.filter(o => o.status === order_entity_1.OrderStatus.DELIVERED).length;
        const pendingOrders = orders.filter(o => o.status === order_entity_1.OrderStatus.PENDING).length;
        const totalRevenue = orders
            .filter(o => o.status !== order_entity_1.OrderStatus.CANCELLED)
            .reduce((sum, o) => sum + Number(o.totalAmount), 0);
        const products = await this.productsRepository.find({
            where: { sellerId },
        });
        const totalProducts = products.length;
        const activeProducts = products.filter(p => p.status === 'active').length;
        const outOfStock = products.filter(p => p.stockQuantity === 0).length;
        const revenueByDay = await this.getSellerRevenueByDay(sellerId, fromDate, toDate);
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
    async getRevenueByDay(fromDate, toDate) {
        const orders = await this.ordersRepository.find({
            where: {
                createdAt: (0, typeorm_2.Between)(fromDate, toDate),
                status: order_entity_1.OrderStatus.DELIVERED,
            },
        });
        const revenueMap = new Map();
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
    async getSellerRevenueByDay(sellerId, fromDate, toDate) {
        const orders = await this.ordersRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.items', 'items')
            .where('items.sellerId = :sellerId', { sellerId })
            .andWhere('order.createdAt BETWEEN :fromDate AND :toDate', { fromDate, toDate })
            .andWhere('order.status = :status', { status: order_entity_1.OrderStatus.DELIVERED })
            .getMany();
        const revenueMap = new Map();
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
    async getTopSellingProducts(limit = 10) {
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
    async getTopSellers(limit = 10) {
        const sellers = await this.sellersRepository.find({
            where: { status: 'approved' },
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
    async getSalesReport(dateFrom, dateTo) {
        const orders = await this.ordersRepository.find({
            where: {
                createdAt: (0, typeorm_2.Between)(dateFrom, dateTo),
            },
            relations: ['items'],
        });
        const totalOrders = orders.length;
        const totalRevenue = orders
            .filter(o => o.status !== order_entity_1.OrderStatus.CANCELLED)
            .reduce((sum, o) => sum + Number(o.totalAmount), 0);
        const totalItemsSold = orders.reduce((sum, o) => sum + o.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
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
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(seller_entity_1.Seller)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map