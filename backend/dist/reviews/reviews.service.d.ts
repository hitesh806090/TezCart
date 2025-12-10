import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { ReviewHelpfulVote } from '../entities/review-helpful.entity';
import { Product } from '../entities/product.entity';
import { CreateReviewDto, UpdateReviewDto, ReviewQueryDto, SellerResponseDto, VoteReviewDto } from './dto/review.dto';
export declare class ReviewsService {
    private reviewsRepository;
    private votesRepository;
    private productsRepository;
    constructor(reviewsRepository: Repository<Review>, votesRepository: Repository<ReviewHelpfulVote>, productsRepository: Repository<Product>);
    create(productId: string, createReviewDto: CreateReviewDto, userId: string): Promise<Review>;
    findAllByProduct(productId: string, query: ReviewQueryDto): Promise<{
        data: Review[];
        total: number;
        averageRating: number;
        ratingDistribution: any;
    }>;
    findOne(id: string): Promise<Review>;
    update(id: string, updateReviewDto: UpdateReviewDto, userId: string): Promise<Review>;
    remove(id: string, userId: string, userRole: string): Promise<void>;
    addSellerResponse(id: string, sellerResponseDto: SellerResponseDto, userId: string): Promise<Review>;
    voteHelpful(reviewId: string, voteDto: VoteReviewDto, userId: string): Promise<{
        helpfulCount: number;
        notHelpfulCount: number;
    }>;
    private updateProductRating;
    private getProductRatingStats;
    getMyReviews(userId: string, page?: number, limit?: number): Promise<{
        data: Review[];
        total: number;
    }>;
}
