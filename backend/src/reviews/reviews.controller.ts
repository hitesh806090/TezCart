import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import {
    CreateReviewDto,
    UpdateReviewDto,
    ReviewQueryDto,
    SellerResponseDto,
    VoteReviewDto,
} from './dto/review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @Post('products/:productId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a review for a product' })
    @ApiParam({ name: 'productId', description: 'Product ID' })
    @ApiResponse({ status: 201, description: 'Review created successfully' })
    @ApiResponse({ status: 409, description: 'You have already reviewed this product' })
    create(
        @Param('productId') productId: string,
        @Body() createReviewDto: CreateReviewDto,
        @Request() req: any,
    ) {
        return this.reviewsService.create(productId, createReviewDto, req.user.userId);
    }

    @Get('products/:productId')
    @ApiOperation({ summary: 'Get all reviews for a product' })
    @ApiParam({ name: 'productId', description: 'Product ID' })
    @ApiResponse({ status: 200, description: 'Returns reviews with statistics' })
    findAllByProduct(@Param('productId') productId: string, @Query() query: ReviewQueryDto) {
        return this.reviewsService.findAllByProduct(productId, query);
    }

    @Get('my-reviews')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get my reviews' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Returns user reviews' })
    getMyReviews(
        @Request() req: any,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 20;
        return this.reviewsService.getMyReviews(req.user.userId, pageNum, limitNum);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a review by ID' })
    @ApiResponse({ status: 200, description: 'Returns the review' })
    @ApiResponse({ status: 404, description: 'Review not found' })
    findOne(@Param('id') id: string) {
        return this.reviewsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update your review' })
    @ApiResponse({ status: 200, description: 'Review updated successfully' })
    @ApiResponse({ status: 403, description: 'You can only edit your own reviews' })
    update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto, @Request() req: any) {
        return this.reviewsService.update(id, updateReviewDto, req.user.userId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete your review' })
    @ApiResponse({ status: 200, description: 'Review deleted successfully' })
    @ApiResponse({ status: 403, description: 'You cannot delete this review' })
    remove(@Param('id') id: string, @Request() req: any) {
        return this.reviewsService.remove(id, req.user.userId, req.user.role);
    }

    @Post(':id/seller-response')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Add seller response to review (Seller only)' })
    @ApiResponse({ status: 200, description: 'Seller response added successfully' })
    @ApiResponse({ status: 403, description: 'Only the product seller can respond' })
    addSellerResponse(
        @Param('id') id: string,
        @Body() sellerResponseDto: SellerResponseDto,
        @Request() req: any,
    ) {
        return this.reviewsService.addSellerResponse(id, sellerResponseDto, req.user.userId);
    }

    @Post(':id/vote')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Vote if review is helpful' })
    @ApiResponse({ status: 200, description: 'Vote recorded successfully' })
    voteHelpful(@Param('id') id: string, @Body() voteDto: VoteReviewDto, @Request() req: any) {
        return this.reviewsService.voteHelpful(id, voteDto, req.user.userId);
    }
}
