"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductQaModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const product_qa_service_1 = require("./product-qa.service");
const product_qa_controller_1 = require("./product-qa.controller");
const product_question_entity_1 = require("../entities/product-question.entity");
const product_answer_entity_1 = require("../entities/product-answer.entity");
const product_entity_1 = require("../entities/product.entity");
let ProductQaModule = class ProductQaModule {
};
exports.ProductQaModule = ProductQaModule;
exports.ProductQaModule = ProductQaModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([product_question_entity_1.ProductQuestion, product_answer_entity_1.ProductAnswer, product_entity_1.Product])],
        controllers: [product_qa_controller_1.ProductQaController],
        providers: [product_qa_service_1.ProductQaService],
        exports: [product_qa_service_1.ProductQaService],
    })
], ProductQaModule);
//# sourceMappingURL=product-qa.module.js.map