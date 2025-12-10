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
exports.ProductQaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const product_qa_service_1 = require("./product-qa.service");
const qa_dto_1 = require("./dto/qa.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ProductQaController = class ProductQaController {
    productQaService;
    constructor(productQaService) {
        this.productQaService = productQaService;
    }
    createQuestion(productId, createQuestionDto, req) {
        return this.productQaService.createQuestion(productId, createQuestionDto, req.user.userId);
    }
    getQuestions(productId, query) {
        return this.productQaService.getQuestions(productId, query);
    }
    getQuestion(id) {
        return this.productQaService.getQuestion(id);
    }
    createAnswer(id, createAnswerDto, req) {
        return this.productQaService.createAnswer(id, createAnswerDto, req.user.userId);
    }
    markQuestionHelpful(id) {
        return this.productQaService.markQuestionHelpful(id);
    }
    markAnswerHelpful(id) {
        return this.productQaService.markAnswerHelpful(id);
    }
    async deleteQuestion(id, req) {
        await this.productQaService.deleteQuestion(id, req.user.userId, req.user.role);
        return { message: 'Question deleted successfully' };
    }
    async deleteAnswer(id, req) {
        await this.productQaService.deleteAnswer(id, req.user.userId, req.user.role);
        return { message: 'Answer deleted successfully' };
    }
    getMyQuestions(req, page, limit) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 20;
        return this.productQaService.getMyQuestions(req.user.userId, pageNum, limitNum);
    }
};
exports.ProductQaController = ProductQaController;
__decorate([
    (0, common_1.Post)('products/:productId/questions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Ask a question about a product' }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'Product ID' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Question created successfully' }),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, qa_dto_1.CreateQuestionDto, Object]),
    __metadata("design:returntype", void 0)
], ProductQaController.prototype, "createQuestion", null);
__decorate([
    (0, common_1.Get)('products/:productId/questions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all questions for a product' }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'Product ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns questions with answers' }),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, qa_dto_1.QuestionQueryDto]),
    __metadata("design:returntype", void 0)
], ProductQaController.prototype, "getQuestions", null);
__decorate([
    (0, common_1.Get)('questions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get question by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Question ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the question with answers' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductQaController.prototype, "getQuestion", null);
__decorate([
    (0, common_1.Post)('questions/:id/answers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Answer a question' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Question ID' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Answer created successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, qa_dto_1.CreateAnswerDto, Object]),
    __metadata("design:returntype", void 0)
], ProductQaController.prototype, "createAnswer", null);
__decorate([
    (0, common_1.Post)('questions/:id/helpful'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark question as helpful' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Question ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Question marked as helpful' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductQaController.prototype, "markQuestionHelpful", null);
__decorate([
    (0, common_1.Post)('answers/:id/helpful'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark answer as helpful' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Answer ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Answer marked as helpful' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductQaController.prototype, "markAnswerHelpful", null);
__decorate([
    (0, common_1.Delete)('questions/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete question' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Question ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Question deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductQaController.prototype, "deleteQuestion", null);
__decorate([
    (0, common_1.Delete)('answers/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete answer' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Answer ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Answer deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductQaController.prototype, "deleteAnswer", null);
__decorate([
    (0, common_1.Get)('my-questions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get my questions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns user questions' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], ProductQaController.prototype, "getMyQuestions", null);
exports.ProductQaController = ProductQaController = __decorate([
    (0, swagger_1.ApiTags)('product-qa'),
    (0, common_1.Controller)('product-qa'),
    __metadata("design:paramtypes", [product_qa_service_1.ProductQaService])
], ProductQaController);
//# sourceMappingURL=product-qa.controller.js.map