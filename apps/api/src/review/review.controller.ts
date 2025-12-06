import { Controller, Get, Post, Put, Param, Body, HttpCode, HttpStatus, UseGuards, Request, Query, UnauthorizedException } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { User } from 'db';

class SubmitProductReviewDto {
  productId: string;
  orderId: string;
  rating: number;
  comment?: string;
  imageUrls?: string[];
}

class SubmitSellerRatingDto {
  sellerId: string;
  orderId: string;
  rating: number;
  comment?: string;
}

class ReviewModerationDto {
    status: 'approved' | 'rejected';
    rejectionReason?: string;
}

class SubmitQuestionDto {
  productId: string;
  question: string;
}

class SubmitAnswerDto {
  answer: string;
}

class QaModerationDto {
    status: 'published' | 'rejected';
}

@ApiTags('Reviews & Ratings / Q&A')
@Controller('reviews')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // All review operations require authentication
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // --- Product Reviews ---
  @Post('product')
  @HttpCode(HttpStatus.CREATED)
  async submitProductReview(@Body() submitDto: SubmitProductReviewDto, @Request() req: { user: User }) {
    return this.reviewService.submitProductReview(
      req.user.id,
      submitDto.productId,
      submitDto.orderId,
      submitDto.rating,
      submitDto.comment,
      submitDto.imageUrls,
    );
  }

  @Get('product/:productId')
  @HttpCode(HttpStatus.OK)
  async getProductReviews(@Param('productId') productId: string) {
    return this.reviewService.getProductReviews(productId);
  }

  @Get('product/:productId/average-rating')
  @HttpCode(HttpStatus.OK)
  async getAverageProductRating(@Param('productId') productId: string) {
    return this.reviewService.getAverageProductRating(productId);
  }

  // --- Seller Ratings ---
  @Post('seller')
  @HttpCode(HttpStatus.CREATED)
  async submitSellerRating(@Body() submitDto: SubmitSellerRatingDto, @Request() req: { user: User }) {
    return this.reviewService.submitSellerRating(
      req.user.id,
      submitDto.sellerId,
      submitDto.orderId,
      submitDto.rating,
      submitDto.comment,
    );
  }

  @Get('seller/:sellerId')
  @HttpCode(HttpStatus.OK)
  async getSellerRatings(@Param('sellerId') sellerId: string) {
    return this.reviewService.getSellerRatings(sellerId);
  }

  @Get('seller/:sellerId/average-rating')
  @HttpCode(HttpStatus.OK)
  async getAverageSellerRating(@Param('sellerId') sellerId: string) {
    return this.reviewService.getAverageSellerRating(sellerId);
  }

  // --- Product Questions & Answers ---
  @Post('product/:productId/question')
  @HttpCode(HttpStatus.CREATED)
  async submitProductQuestion(@Param('productId') productId: string, @Body() submitDto: SubmitQuestionDto, @Request() req: { user: User }) {
    return this.reviewService.submitProductQuestion(req.user.id, productId, submitDto.question);
  }

  @Get('product/:productId/qa')
  @HttpCode(HttpStatus.OK)
  async getProductQuestions(@Param('productId') productId: string) {
    return this.reviewService.getProductQuestions(productId);
  }

  @Post('question/:questionId/answer')
  @UseGuards(RolesGuard)
  @Roles('seller', 'admin', 'super_admin') // Only seller (of product) or admin can answer
  @HttpCode(HttpStatus.CREATED)
  async submitProductAnswer(@Param('questionId') questionId: string, @Body() submitDto: SubmitAnswerDto, @Request() req: { user: User }) {
    return this.reviewService.submitProductAnswer(req.user.id, questionId, submitDto.answer);
  }


  // --- Admin Moderation Endpoints ---
  @Get('admin/product-reviews/pending')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  getPendingProductReviews() {
    return this.reviewService.getPendingProductReviews();
  }

  @Put('admin/product-reviews/:id/moderate')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  moderateProductReview(@Param('id') id: string, @Body() moderationDto: ReviewModerationDto) {
    return this.reviewService.reviewProductReview(id, moderationDto.status, moderationDto.rejectionReason);
  }

  @Get('admin/seller-ratings/pending')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  getPendingSellerRatings() {
    return this.reviewService.getPendingSellerRatings();
  }

  @Put('admin/seller-ratings/:id/moderate')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  moderateSellerRating(@Param('id') id: string, @Body() moderationDto: ReviewModerationDto) {
    return this.reviewService.reviewSellerRating(id, moderationDto.status, moderationDto.rejectionReason);
  }

  @Get('admin/product-questions/pending')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  getPendingProductQuestions() {
      return this.reviewService.getPendingProductQuestions();
  }

  @Put('admin/product-questions/:id/moderate')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  moderateProductQuestion(@Param('id') id: string, @Body() moderationDto: QaModerationDto) {
      return this.reviewService.reviewProductQuestion(id, moderationDto.status);
  }

  @Get('admin/product-answers/pending')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  getPendingProductAnswers() {
      return this.reviewService.getPendingProductAnswers();
  }

  @Put('admin/product-answers/:id/moderate')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  moderateProductAnswer(@Param('id') id: string, @Body() moderationDto: QaModerationDto) {
      return this.reviewService.reviewProductAnswer(id, moderationDto.status);
  }
}
