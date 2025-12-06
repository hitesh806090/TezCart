import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailySalesMetric } from 'db';
import { ProductMetric } from 'db';
import { Order } from 'db';
import { AnalyticsEvent } from 'db';
import { Tenant } from 'db';

@Injectable()
export class AnalyticsSyncService {
  private readonly logger = new Logger(AnalyticsSyncService.name);

  constructor(
    @InjectRepository(DailySalesMetric)
    private readonly dailySalesMetricRepository: Repository<DailySalesMetric>,
    @InjectRepository(ProductMetric)
    private readonly productMetricRepository: Repository<ProductMetric>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(AnalyticsEvent)
    private readonly analyticsEventRepository: Repository<AnalyticsEvent>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  // Run daily at midnight to aggregate previous day's data
  // For testing, can be triggered manually or run more frequently
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncDailyMetrics() {
    this.logger.log('Starting daily analytics sync...');
    
    // Get all tenants to process
    const tenants = await this.tenantRepository.find();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateString = yesterday.toISOString().split('T')[0];
    const startOfDay = new Date(dateString + 'T00:00:00.000Z');
    const endOfDay = new Date(dateString + 'T23:59:59.999Z');

    for (const tenant of tenants) {
        await this.aggregateDailySales(tenant.id, dateString, startOfDay, endOfDay);
        await this.aggregateProductMetrics(tenant.id, dateString, startOfDay, endOfDay);
    }

    this.logger.log('Daily analytics sync completed.');
  }

  private async aggregateDailySales(tenantId: string, date: string, start: Date, end: Date) {
    // 1. Sales metrics from Orders
    const { totalGmv, totalOrders } = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'totalGmv')
      .addSelect('COUNT(order.id)', 'totalOrders')
      .where('order.tenantId = :tenantId', { tenantId })
      .andWhere('order.createdAt BETWEEN :start AND :end', { start, end })
      .andWhere('order.status != :cancelled', { cancelled: 'cancelled' }) // Exclude cancelled
      .getRawOne();

    // 2. Visitor metrics from Analytics Events
    const { totalVisitors } = await this.analyticsEventRepository
      .createQueryBuilder('event')
      .select('COUNT(DISTINCT event.sessionId)', 'totalVisitors')
      .where('event.tenantId = :tenantId', { tenantId })
      .andWhere('event.eventTimestamp BETWEEN :start AND :end', { start, end })
      .getRawOne();

    // 3. Conversion Rate
    const visitors = parseInt(totalVisitors) || 0;
    const orders = parseInt(totalOrders) || 0;
    const conversionRate = visitors > 0 ? (orders / visitors) * 100 : 0;

    // 4. Save/Update Metric
    let metric = await this.dailySalesMetricRepository.findOne({ where: { tenantId, date } });
    if (!metric) {
        metric = this.dailySalesMetricRepository.create({ tenantId, date });
    }

    metric.totalGmv = parseFloat(totalGmv) || 0;
    metric.totalOrders = orders;
    metric.totalVisitors = visitors;
    metric.conversionRate = conversionRate;
    // Populate categoryBreakdown and paymentMethodBreakdown logic here if needed

    await this.dailySalesMetricRepository.save(metric);
    this.logger.debug(`Aggregated sales for tenant ${tenantId} on ${date}`);
  }

  private async aggregateProductMetrics(tenantId: string, date: string, start: Date, end: Date) {
    // This would be more complex, aggregating product_view events and order items.
    // Simplified placeholder logic.
    
    // 1. Product Views
    const productViews = await this.analyticsEventRepository
        .createQueryBuilder('event')
        .select('event.productId', 'productId')
        .addSelect('COUNT(*)', 'views')
        .where('event.tenantId = :tenantId', { tenantId })
        .andWhere('event.eventType = :type', { type: 'product_view' })
        .andWhere('event.eventTimestamp BETWEEN :start AND :end', { start, end })
        .groupBy('event.productId')
        .getRawMany();

    for (const viewData of productViews) {
        if (!viewData.productId) continue;

        let metric = await this.productMetricRepository.findOne({ where: { tenantId, productId: viewData.productId, date } });
        if (!metric) {
            metric = this.productMetricRepository.create({ tenantId, productId: viewData.productId, date });
        }
        metric.views = parseInt(viewData.views);
        // Add logic for addToCarts, orders, revenue from OrderItems table
        await this.productMetricRepository.save(metric);
    }
    this.logger.debug(`Aggregated product metrics for tenant ${tenantId} on ${date}`);
  }
}