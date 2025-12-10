import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductQuestion } from '../entities/product-question.entity';
import { ProductAnswer } from '../entities/product-answer.entity';
import { Product } from '../entities/product.entity';
import { CreateQuestionDto, CreateAnswerDto, QuestionQueryDto } from './dto/qa.dto';

@Injectable()
export class ProductQaService {
    constructor(
        @InjectRepository(ProductQuestion)
        private questionsRepository: Repository<ProductQuestion>,
        @InjectRepository(ProductAnswer)
        private answersRepository: Repository<ProductAnswer>,
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) { }

    async createQuestion(
        productId: string,
        createQuestionDto: CreateQuestionDto,
        userId: string,
    ): Promise<ProductQuestion> {
        const product = await this.productsRepository.findOne({ where: { id: productId } });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const question = this.questionsRepository.create({
            productId,
            userId,
            question: createQuestionDto.question,
        });

        return this.questionsRepository.save(question);
    }

    async getQuestions(
        productId: string,
        query: QuestionQueryDto,
    ): Promise<{ data: ProductQuestion[]; total: number }> {
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

    async getQuestion(id: string): Promise<ProductQuestion> {
        const question = await this.questionsRepository.findOne({
            where: { id },
            relations: ['answers', 'answers.user', 'user', 'product'],
        });

        if (!question) {
            throw new NotFoundException('Question not found');
        }

        return question;
    }

    async createAnswer(
        questionId: string,
        createAnswerDto: CreateAnswerDto,
        userId: string,
    ): Promise<ProductAnswer> {
        const question = await this.getQuestion(questionId);

        // Check if user is the seller
        const isSellerAnswer = question.product.sellerId === userId;

        // TODO: Check if user has purchased the product
        const isVerifiedPurchase = false;

        const answer = this.answersRepository.create({
            questionId,
            userId,
            answer: createAnswerDto.answer,
            isSellerAnswer,
            isVerifiedPurchase,
        });

        const savedAnswer = await this.answersRepository.save(answer);

        // Update question answer count
        await this.updateQuestionAnswerCount(questionId);

        return savedAnswer;
    }

    async deleteQuestion(id: string, userId: string, userRole: string): Promise<void> {
        const question = await this.getQuestion(id);

        // Only question owner or admin can delete
        if (question.userId !== userId && userRole !== 'admin') {
            throw new ForbiddenException('You cannot delete this question');
        }

        await this.questionsRepository.remove(question);
    }

    async deleteAnswer(id: string, userId: string, userRole: string): Promise<void> {
        const answer = await this.answersRepository.findOne({
            where: { id },
            relations: ['question'],
        });

        if (!answer) {
            throw new NotFoundException('Answer not found');
        }

        // Only answer owner or admin can delete
        if (answer.userId !== userId && userRole !== 'admin') {
            throw new ForbiddenException('You cannot delete this answer');
        }

        const questionId = answer.questionId;
        await this.answersRepository.remove(answer);

        // Update question answer count
        await this.updateQuestionAnswerCount(questionId);
    }

    async markQuestionHelpful(id: string): Promise<ProductQuestion> {
        const question = await this.getQuestion(id);
        question.helpfulCount += 1;
        return this.questionsRepository.save(question);
    }

    async markAnswerHelpful(id: string): Promise<ProductAnswer> {
        const answer = await this.answersRepository.findOne({ where: { id } });

        if (!answer) {
            throw new NotFoundException('Answer not found');
        }

        answer.helpfulCount += 1;
        return this.answersRepository.save(answer);
    }

    private async updateQuestionAnswerCount(questionId: string): Promise<void> {
        const count = await this.answersRepository.count({
            where: { questionId, isPublished: true },
        });

        await this.questionsRepository.update(
            { id: questionId },
            { answerCount: count, hasAnswer: count > 0 },
        );
    }

    async getMyQuestions(
        userId: string,
        page: number = 1,
        limit: number = 20,
    ): Promise<{ data: ProductQuestion[]; total: number }> {
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
}
