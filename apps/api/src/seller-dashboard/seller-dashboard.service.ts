import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'db';
import { OrderItem } from 'db';
import { TenantProvider } from '..//common/tenant.module';
import { OrderService } from '..//order/order.service'; // To fetch seller orders

@Injectable()
export class SellerDashboardService {
  private readonly logger = new Logger(SellerDashboardService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly tenantProvider: TenantProvider,
    private readonly orderService: OrderService,
  ) {}

  private get tenantId(): string {
    const tenantId = this.tenantProvider.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing.');
    }
    return tenantId;
  }

  async getSellerMetrics(sellerId: string, startDate?: Date, endDate?: Date): Promise<any> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order')
      .where('order.sellerId = :sellerId', { sellerId })
      .andWhere('order.tenantId = :tenantId', { tenantId: this.tenantId })
      .andWhere('order.parentOrderId IS NOT NULL'); // Only child orders for seller metrics

    if (startDate) {
      queryBuilder.andWhere('order.createdAt >= :startDate', { startDate });
    }
    if (endDate) {
      queryBuilder.andWhere('order.createdAt <= :endDate', { endDate });
    }

    const [orders, totalOrders] = await queryBuilder.getManyAndCount();

    const salesOrders = orders.filter(order => order.status === 'confirmed' || order.status === 'shipped' || order.status === 'delivered');
    const totalSales = salesOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

    const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;
    // Add logic for returns/refunds here later

    const orderStatusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    return {
      totalOrders: totalOrders,
      totalSales: totalSales,
      totalSalesOrders: salesOrders.length,
      cancelledOrders: cancelledOrders,
      orderStatusCounts: orderStatusCounts,
      // More metrics like AOV, conversion rate, top products can be added
    };
  }

  async getSellerOrdersOverview(sellerId: string, startDate?: Date, endDate?: Date): Promise<Order[]> {
    return this.orderService.findSellerOrders(sellerId); // Leverages existing service
  }
}