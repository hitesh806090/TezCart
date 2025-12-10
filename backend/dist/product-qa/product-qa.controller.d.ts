import { ProductQaService } from './product-qa.service';
import { CreateQuestionDto, CreateAnswerDto, QuestionQueryDto } from './dto/qa.dto';
export declare class ProductQaController {
    private readonly productQaService;
    constructor(productQaService: ProductQaService);
    createQuestion(productId: string, createQuestionDto: CreateQuestionDto, req: any): Promise<import("../entities/product-question.entity").ProductQuestion>;
    getQuestions(productId: string, query: QuestionQueryDto): Promise<{
        data: import("../entities/product-question.entity").ProductQuestion[];
        total: number;
    }>;
    getQuestion(id: string): Promise<import("../entities/product-question.entity").ProductQuestion>;
    createAnswer(id: string, createAnswerDto: CreateAnswerDto, req: any): Promise<import("../entities/product-answer.entity").ProductAnswer>;
    markQuestionHelpful(id: string): Promise<import("../entities/product-question.entity").ProductQuestion>;
    markAnswerHelpful(id: string): Promise<import("../entities/product-answer.entity").ProductAnswer>;
    deleteQuestion(id: string, req: any): Promise<{
        message: string;
    }>;
    deleteAnswer(id: string, req: any): Promise<{
        message: string;
    }>;
    getMyQuestions(req: any, page?: string, limit?: string): Promise<{
        data: import("../entities/product-question.entity").ProductQuestion[];
        total: number;
    }>;
}
