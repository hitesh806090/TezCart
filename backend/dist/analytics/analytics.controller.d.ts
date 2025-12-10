import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getAdminDashboard(dateFrom?: string, dateTo?: string): Promise<any>;
    getSellerDashboard(req: any, dateFrom?: string, dateTo?: string): Promise<any>;
    getSalesReport(dateFrom: string, dateTo: string): Promise<any>;
}
