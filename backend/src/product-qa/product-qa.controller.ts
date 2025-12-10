import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ProductQaService } from './product-qa.service';
import { CreateQuestionDto, CreateAnswerDto, QuestionQueryDto } from './dto/qa.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('product-qa')
@Controller('product-qa')
export class ProductQaController {
    constructor(private readonly productQaService: ProductQaService) { }

    @Post('products/:productId/questions')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Ask a question about a product' })
    @ApiParam({ name: 'productId', description: 'Product ID' })
    @ApiResponse({ status: 201, description: 'Question created successfully' })
    createQuestion(
        @Param('productId') productId: string,
        @Body() createQuestionDto: CreateQuestionDto,
        @Request() req: any,
    ) {
        return this.productQaService.createQuestion(productId, createQuestionDto, req.user.userId);
    }

    @Get('products/:productId/questions')
    @ApiOperation({ summary: 'Get all questions for a product' })
    @ApiParam({ name: 'productId', description: 'Product ID' })
    @ApiResponse({ status: 200, description: 'Returns questions with answers' })
    getQuestions(@Param('productId') productId: string, @Query() query: QuestionQueryDto) {
        return this.productQaService.getQuestions(productId, query);
    }

    @Get('questions/:id')
    @ApiOperation({ summary: 'Get question by ID' })
    @ApiParam({ name: 'id', description: 'Question ID' })
    @ApiResponse({ status: 200, description: 'Returns the question with answers' })
    getQuestion(@Param('id') id: string) {
        return this.productQaService.getQuestion(id);
    }

    @Post('questions/:id/answers')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Answer a question' })
    @ApiParam({ name: 'id', description: 'Question ID' })
    @ApiResponse({ status: 201, description: 'Answer created successfully' })
    createAnswer(
        @Param('id') id: string,
        @Body() createAnswerDto: CreateAnswerDto,
        @Request() req: any,
    ) {
        return this.productQaService.createAnswer(id, createAnswerDto, req.user.userId);
    }

    @Post('questions/:id/helpful')
    @ApiOperation({ summary: 'Mark question as helpful' })
    @ApiParam({ name: 'id', description: 'Question ID' })
    @ApiResponse({ status: 200, description: 'Question marked as helpful' })
    markQuestionHelpful(@Param('id') id: string) {
        return this.productQaService.markQuestionHelpful(id);
    }

    @Post('answers/:id/helpful')
    @ApiOperation({ summary: 'Mark answer as helpful' })
    @ApiParam({ name: 'id', description: 'Answer ID' })
    @ApiResponse({ status: 200, description: 'Answer marked as helpful' })
    markAnswerHelpful(@Param('id') id: string) {
        return this.productQaService.markAnswerHelpful(id);
    }

    @Delete('questions/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete question' })
    @ApiParam({ name: 'id', description: 'Question ID' })
    @ApiResponse({ status: 200, description: 'Question deleted successfully' })
    async deleteQuestion(@Param('id') id: string, @Request() req: any) {
        await this.productQaService.deleteQuestion(id, req.user.userId, req.user.role);
        return { message: 'Question deleted successfully' };
    }

    @Delete('answers/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete answer' })
    @ApiParam({ name: 'id', description: 'Answer ID' })
    @ApiResponse({ status: 200, description: 'Answer deleted successfully' })
    async deleteAnswer(@Param('id') id: string, @Request() req: any) {
        await this.productQaService.deleteAnswer(id, req.user.userId, req.user.role);
        return { message: 'Answer deleted successfully' };
    }

    @Get('my-questions')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get my questions' })
    @ApiResponse({ status: 200, description: 'Returns user questions' })
    getMyQuestions(
        @Request() req: any,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 20;
        return this.productQaService.getMyQuestions(req.user.userId, pageNum, limitNum);
    }
}
