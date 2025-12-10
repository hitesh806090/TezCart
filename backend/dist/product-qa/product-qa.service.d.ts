import { Repository } from 'typeorm';
import { ProductQuestion } from '../entities/product-question.entity';
import { ProductAnswer } from '../entities/product-answer.entity';
import { Product } from '../entities/product.entity';
import { CreateQuestionDto, CreateAnswerDto, QuestionQueryDto } from './dto/qa.dto';
export declare class ProductQaService {
    private questionsRepository;
    private answersRepository;
    private productsRepository;
    constructor(questionsRepository: Repository<ProductQuestion>, answersRepository: Repository<ProductAnswer>, productsRepository: Repository<Product>);
    createQuestion(productId: string, createQuestionDto: CreateQuestionDto, userId: string): Promise<ProductQuestion>;
    getQuestions(productId: string, query: QuestionQueryDto): Promise<{
        data: ProductQuestion[];
        total: number;
    }>;
    getQuestion(id: string): Promise<ProductQuestion>;
    createAnswer(questionId: string, createAnswerDto: CreateAnswerDto, userId: string): Promise<ProductAnswer>;
    deleteQuestion(id: string, userId: string, userRole: string): Promise<void>;
    deleteAnswer(id: string, userId: string, userRole: string): Promise<void>;
    markQuestionHelpful(id: string): Promise<ProductQuestion>;
    markAnswerHelpful(id: string): Promise<ProductAnswer>;
    private updateQuestionAnswerCount;
    getMyQuestions(userId: string, page?: number, limit?: number): Promise<{
        data: ProductQuestion[];
        total: number;
    }>;
}
