import { Injectable, NotFoundException, BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductReview } from 'db';
import { SellerRating } from 'db';
import { ProductQuestion } from 'db'; // Import ProductQuestion
import { ProductAnswer } from 'db'; // Import ProductAnswer
import { TenantProvider } from '..//common/tenant.module';
import { OrderService } from '../order/order.service'; // To verify purchases
import { ProductService } from '../product/product.service'; // To get product details
import { SellerService } from '../seller/seller.service'; // To get seller details
import { FileUploadService } from '../file-upload/file-upload.service'; // For image uploads
import { User } from 'db'; // For user details

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ProductReview)
    private readonly productReviewRepository: Repository<ProductReview>,
    @InjectRepository(SellerRating)
    private readonly sellerRatingRepository: Repository<SellerRating>,
    @InjectRepository(ProductQuestion)
    private readonly productQuestionRepository: Repository<ProductQuestion>, // Inject ProductQuestion repository
    @InjectRepository(ProductAnswer)
    private readonly productAnswerRepository: Repository<ProductAnswer>, // Inject ProductAnswer repository
    private readonly tenantProvider: TenantProvider,
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
    private readonly sellerService: SellerService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  private get tenantId(): string {
    const tenantId = this.tenantProvider.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing.');
    }
    return tenantId;
  }

  // --- Product Reviews (Existing methods) ---
  async submitProductReview(
    userId: string,
    productId: string,
    orderId: string,
    rating: number,
    comment?: string,
    imageUrls?: string[],
  ): Promise<ProductReview> {
    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5.');
    }
    const order = await this.orderService.findOrderById(orderId);
    if (!order || order.userId !== userId || order.tenantId !== this.tenantId) {
      throw new NotFoundException('Order not found or not owned by user.');
    }
    const hasProductInOrder = order.items.some(item => item.productId === productId);
    if (!hasProductInOrder) {
      throw new BadRequestException('User has not purchased this product through this order.');
    }
    if (order.status !== 'delivered') {
      throw new BadRequestException('Product can only be reviewed after order is delivered.');
    }
    const existingReview = await this.productReviewRepository.findOne({
      where: { userId, productId, orderId, tenantId: this.tenantId },
    });
    if (existingReview) {
      throw new ConflictException('User has already reviewed this product for this order.');
    }
    const review = this.productReviewRepository.create({
      userId,
      productId,
      orderId,
      rating,
      comment,
      imageUrls,
      tenantId: this.tenantId,
      status: 'pending',
    });
    return this.productReviewRepository.save(review);
  }

  async getProductReviews(productId: string, status?: string): Promise<ProductReview[]> {
    const whereCondition: any = { productId, tenantId: this.tenantId };
    if (status) {
        whereCondition.status = status;
    } else {
        whereCondition.status = 'approved';
    }
    return this.productReviewRepository.find({
      where: whereCondition,
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAverageProductRating(productId: string): Promise<number> {
    const result = await this.productReviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'averageRating')
      .where('review.productId = :productId', { productId })
      .andWhere('review.tenantId = :tenantId', { tenantId: this.tenantId })
      .andWhere('review.status = :status', { status: 'approved' })
      .getRawOne();

    return parseFloat(result.averageRating || 0);
  }

  // --- Seller Ratings (Existing methods) ---
  async submitSellerRating(
    userId: string,
    sellerId: string,
    orderId: string,
    rating: number,
    comment?: string,
  ): Promise<SellerRating> {
    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5.');
    }
    const order = await this.orderService.findOrderById(orderId);
    if (!order || order.userId !== userId || order.tenantId !== this.tenantId) {
      throw new NotFoundException('Order not found or not owned by user.');
    }
    const hasSellerInOrder = order.childOrders.some(childOrder => childOrder.sellerId === sellerId);
    if (!hasSellerInOrder) {
      throw new BadRequestException('User has not purchased from this seller through this order.');
    }
    if (order.status !== 'delivered') {
        throw new BadRequestException('Seller can only be rated after order is delivered.');
    }
    const existingRating = await this.sellerRatingRepository.findOne({
      where: { userId, sellerId, orderId, tenantId: this.tenantId },
    });
    if (existingRating) {
      throw new ConflictException('User has already rated this seller for this order.');
    }
    await this.sellerService.getSellerProfile(sellerId);

    const sellerRating = this.sellerRatingRepository.create({
      userId,
      sellerId,
      orderId,
      rating,
      comment,
      tenantId: this.tenantId,
      status: 'pending',
    });
    return this.sellerRatingRepository.save(sellerRating);
  }

  async getSellerRatings(sellerId: string, status?: string): Promise<SellerRating[]> {
    const whereCondition: any = { sellerId, tenantId: this.tenantId };
    if (status) {
        whereCondition.status = status;
    } else {
        whereCondition.status = 'approved';
    }
    return this.sellerRatingRepository.find({
      where: whereCondition,
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAverageSellerRating(sellerId: string): Promise<number> {
    const result = await this.sellerRatingRepository
      .createQueryBuilder('rating')
      .select('AVG(rating.rating)', 'averageRating')
      .where('rating.sellerId = :sellerId', { sellerId })
      .andWhere('rating.tenantId = :tenantId', { tenantId: this.tenantId })
      .andWhere('rating.status = :status', { status: 'approved' })
      .getRawOne();

    return parseFloat(result.averageRating || 0);
  }

  // --- Moderation Methods (Existing methods for reviews/ratings) ---
  async reviewProductReview(reviewId: string, status: 'approved' | 'rejected', rejectionReason?: string): Promise<ProductReview> {
    const review = await this.productReviewRepository.findOne({ where: { id: reviewId, tenantId: this.tenantId } });
    if (!review) {
      throw new NotFoundException('Product review not found.');
    }
    review.status = status;
    review.rejectionReason = rejectionReason;
    return this.productReviewRepository.save(review);
  }

  async reviewSellerRating(ratingId: string, status: 'approved' | 'rejected', rejectionReason?: string): Promise<SellerRating> {
    const rating = await this.sellerRatingRepository.findOne({ where: { id: ratingId, tenantId: this.tenantId } });
    if (!rating) {
      throw new NotFoundException('Seller rating not found.');
    }
    rating.status = status;
    rating.rejectionReason = rejectionReason;
    return this.sellerRatingRepository.save(rating);
  }

  async getPendingProductReviews(): Promise<ProductReview[]> {
    return this.productReviewRepository.find({ where: { status: 'pending', tenantId: this.tenantId } });
  }

  async getPendingSellerRatings(): Promise<SellerRating[]> {
    return this.sellerRatingRepository.find({ where: { status: 'pending', tenantId: this.tenantId } });
  }

  // --- Product Questions & Answers ---
  async submitProductQuestion(userId: string, productId: string, questionText: string): Promise<ProductQuestion> {
    await this.productService.findProductById(productId); // Ensure product exists
    const question = this.productQuestionRepository.create({
      userId,
      productId,
      question: questionText,
      tenantId: this.tenantId,
      status: 'pending', // Questions might also need moderation
    });
    return this.productQuestionRepository.save(question);
  }

  async getProductQuestions(productId: string, status?: string): Promise<ProductQuestion[]> {
    const whereCondition: any = { productId, tenantId: this.tenantId };
    if (status) {
        whereCondition.status = status;
    } else {
        whereCondition.status = 'published'; // Only show published questions by default
    }
    return this.productQuestionRepository.find({
      where: whereCondition,
      relations: ['user', 'answers', 'answers.user'], // Load user for question and answer
      order: { createdAt: 'ASC' },
    });
  }

  async submitProductAnswer(userId: string, questionId: string, answerText: string): Promise<ProductAnswer> {
    const question = await this.productQuestionRepository.findOne({ where: { id: questionId, tenantId: this.tenantId } });
    if (!question) {
      throw new NotFoundException('Question not found.');
    }
    // Verify user is seller of the product or an admin
    const product = await this.productService.findProductById(question.productId);
    const user = await this.userService.findUserById(userId);
    const isSellerOwner = product.sellerId === userId;
    const isAdmin = user && (user.defaultPersona === 'admin' || user.defaultPersona === 'super_admin');

    if (!isSellerOwner && !isAdmin) {
      throw new UnauthorizedException('Only the product seller or an admin can answer this question.');
    }

    const answer = this.productAnswerRepository.create({
      userId,
      questionId,
      answer: answerText,
      tenantId: this.tenantId,
      status: 'pending', // Answers might also need moderation
    });
    return this.productAnswerRepository.save(answer);
  }

  async getPendingProductQuestions(): Promise<ProductQuestion[]> {
    return this.productQuestionRepository.find({ where: { status: 'pending', tenantId: this.tenantId } });
  }

  async getPendingProductAnswers(): Promise<ProductAnswer[]> {
    return this.productAnswerRepository.find({ where: { status: 'pending', tenantId: this.tenantId } });
  }

  async reviewProductQuestion(questionId: string, status: 'published' | 'rejected'): Promise<ProductQuestion> {
    const question = await this.productQuestionRepository.findOne({ where: { id: questionId, tenantId: this.tenantId } });
    if (!question) {
      throw new NotFoundException('Product question not found.');
    }
    question.status = status;
    return this.productQuestionRepository.save(question);
  }

  async reviewProductAnswer(answerId: string, status: 'published' | 'rejected'): Promise<ProductAnswer> {
    const answer = await this.productAnswerRepository.findOne({ where: { id: answerId, tenantId: this.tenantId } });
    if (!answer) {
      throw new NotFoundException('Product answer not found.');
    }
    answer.status = status;
    return this.productAnswerRepository.save(answer);
  }
}
