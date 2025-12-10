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
exports.ProductQaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_question_entity_1 = require("../entities/product-question.entity");
const product_answer_entity_1 = require("../entities/product-answer.entity");
const product_entity_1 = require("../entities/product.entity");
let ProductQaService = class ProductQaService {
    questionsRepository;
    answersRepository;
    productsRepository;
    constructor(questionsRepository, answersRepository, productsRepository) {
        this.questionsRepository = questionsRepository;
        this.answersRepository = answersRepository;
        this.productsRepository = productsRepository;
    }
    async createQuestion(productId, createQuestionDto, userId) {
        const product = await this.productsRepository.findOne({ where: { id: productId } });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const question = this.questionsRepository.create({
            productId,
            userId,
            question: createQuestionDto.question,
        });
        return this.questionsRepository.save(question);
    }
    async getQuestions(productId, query) {
        const { page = 1, limit = 20, answeredOnly } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.questionsRepository
            .createQueryBuilder('question')
            .leftJoinAndSelect('question.answers', 'answers')
            .leftJoinAndSelect('question.user', 'user')
            .leftJoinAndSelect('answers.user', 'answerUser')
            .where('question.productId = :productId', { productId })
            .andWhere('question.isPublished = :isPublished', { isPublished: true });
        if (answeredOnly) {
            queryBuilder.andWhere('question.hasAnswer = :hasAnswer', { hasAnswer: true });
        }
        queryBuilder
            .orderBy('question.hasAnswer', 'DESC')
            .addOrderBy('question.createdAt', 'DESC')
            .skip(skip)
            .take(limit);
        const [data, total] = await queryBuilder.getManyAndCount();
        return { data, total };
    }
    async getQuestion(id) {
        const question = await this.questionsRepository.findOne({
            where: { id },
            relations: ['answers', 'answers.user', 'user', 'product'],
        });
        if (!question) {
            throw new common_1.NotFoundException('Question not found');
        }
        return question;
    }
    async createAnswer(questionId, createAnswerDto, userId) {
        const question = await this.getQuestion(questionId);
        const isSellerAnswer = question.product.sellerId === userId;
        const isVerifiedPurchase = false;
        const answer = this.answersRepository.create({
            questionId,
            userId,
            answer: createAnswerDto.answer,
            isSellerAnswer,
            isVerifiedPurchase,
        });
        const savedAnswer = await this.answersRepository.save(answer);
        await this.updateQuestionAnswerCount(questionId);
        return savedAnswer;
    }
    async deleteQuestion(id, userId, userRole) {
        const question = await this.getQuestion(id);
        if (question.userId !== userId && userRole !== 'admin') {
            throw new common_1.ForbiddenException('You cannot delete this question');
        }
        await this.questionsRepository.remove(question);
    }
    async deleteAnswer(id, userId, userRole) {
        const answer = await this.answersRepository.findOne({
            where: { id },
            relations: ['question'],
        });
        if (!answer) {
            throw new common_1.NotFoundException('Answer not found');
        }
        if (answer.userId !== userId && userRole !== 'admin') {
            throw new common_1.ForbiddenException('You cannot delete this answer');
        }
        const questionId = answer.questionId;
        await this.answersRepository.remove(answer);
        await this.updateQuestionAnswerCount(questionId);
    }
    async markQuestionHelpful(id) {
        const question = await this.getQuestion(id);
        question.helpfulCount += 1;
        return this.questionsRepository.save(question);
    }
    async markAnswerHelpful(id) {
        const answer = await this.answersRepository.findOne({ where: { id } });
        if (!answer) {
            throw new common_1.NotFoundException('Answer not found');
        }
        answer.helpfulCount += 1;
        return this.answersRepository.save(answer);
    }
    async updateQuestionAnswerCount(questionId) {
        const count = await this.answersRepository.count({
            where: { questionId, isPublished: true },
        });
        await this.questionsRepository.update({ id: questionId }, { answerCount: count, hasAnswer: count > 0 });
    }
    async getMyQuestions(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [data, total] = await this.questionsRepository.findAndCount({
            where: { userId },
            relations: ['product', 'answers'],
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
        });
        return { data, total };
    }
};
exports.ProductQaService = ProductQaService;
exports.ProductQaService = ProductQaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_question_entity_1.ProductQuestion)),
    __param(1, (0, typeorm_1.InjectRepository)(product_answer_entity_1.ProductAnswer)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProductQaService);
//# sourceMappingURL=product-qa.service.js.map