import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyticsEvent } from 'db';
import { TenantProvider } from '..//common/tenant.module';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(AnalyticsEvent)
    private readonly analyticsEventRepository: Repository<AnalyticsEvent>,
    private readonly tenantProvider: TenantProvider,
  ) {}

  private get tenantId(): string {
    const tenantId = this.tenantProvider.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing.');
    }
    return tenantId;
  }

  async trackEvent(
    eventType: string,
    userId: string | null,
    sessionId: string,
    eventData: object,
    pageUrl: string,
    ipAddress: string,
    userAgent: string,
    productId?: string,
    orderId?: string,
  ): Promise<AnalyticsEvent> {
    const event = this.analyticsEventRepository.create({
      tenantId: this.tenantId,
      eventType,
      userId,
      sessionId,
      eventData,
      pageUrl,
      ipAddress,
      userAgent,
      productId,
      orderId,
      eventTimestamp: new Date(),
    });
    return this.analyticsEventRepository.save(event);
  }

  // Methods to aggregate data for dashboards (simplified for MVP)
  // In a real scenario, this would likely query an OLAP DB or use complex aggregations
  async getEventCounts(eventType: string, startDate?: Date, endDate?: Date): Promise<number> {
    const queryBuilder = this.analyticsEventRepository.createQueryBuilder('event')
      .where('event.eventType = :eventType', { eventType })
      .andWhere('event.tenantId = :tenantId', { tenantId: this.tenantId });

    if (startDate) {
      queryBuilder.andWhere('event.eventTimestamp >= :startDate', { startDate });
    }
    if (endDate) {
      queryBuilder.andWhere('event.eventTimestamp <= :endDate', { endDate });
    }

    return queryBuilder.getCount();
  }
}