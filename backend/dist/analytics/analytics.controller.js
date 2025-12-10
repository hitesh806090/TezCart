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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const analytics_service_1 = require("./analytics.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let AnalyticsController = class AnalyticsController {
    analyticsService;
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    getAdminDashboard(dateFrom, dateTo) {
        const from = dateFrom ? new Date(dateFrom) : undefined;
        const to = dateTo ? new Date(dateTo) : undefined;
        return this.analyticsService.getAdminDashboard(from, to);
    }
    getSellerDashboard(req, dateFrom, dateTo) {
        const from = dateFrom ? new Date(dateFrom) : undefined;
        const to = dateTo ? new Date(dateTo) : undefined;
        return this.analyticsService.getSellerDashboard(req.user.userId, from, to);
    }
    getSalesReport(dateFrom, dateTo) {
        return this.analyticsService.getSalesReport(new Date(dateFrom), new Date(dateTo));
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('admin/dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get admin dashboard analytics (Admin only)' }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false, example: '2025-01-01' }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false, example: '2025-12-31' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns admin dashboard data' }),
    __param(0, (0, common_1.Query)('dateFrom')),
    __param(1, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getAdminDashboard", null);
__decorate([
    (0, common_1.Get)('seller/dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get seller dashboard analytics' }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false, example: '2025-01-01' }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false, example: '2025-12-31' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns seller dashboard data' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('dateFrom')),
    __param(2, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getSellerDashboard", null);
__decorate([
    (0, common_1.Get)('sales-report'),
    (0, swagger_1.ApiOperation)({ summary: 'Get sales report (Admin only)' }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: true, example: '2025-01-01' }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: true, example: '2025-12-31' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns sales report' }),
    __param(0, (0, common_1.Query)('dateFrom')),
    __param(1, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getSalesReport", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('analytics'),
    (0, common_1.Controller)('analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map