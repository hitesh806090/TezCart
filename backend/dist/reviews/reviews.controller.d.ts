import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto, ReviewQueryDto, SellerResponseDto, VoteReviewDto } from './dto/review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(productId: string, createReviewDto: CreateReviewDto, req: any): Promise<import("../entities/review.entity").Review>;
    findAllByProduct(productId: string, query: ReviewQueryDto): Promise<{
        data: import("../entities/review.entity").Review[];
        total: number;
        averageRating: number;
        ratingDistribution: any;
    }>;
    getMyReviews(req: any, page?: string, limit?: string): Promise<{
        data: import("../entities/review.entity").Review[];
        total: number;
    }>;
    findOne(id: string): Promise<import("../entities/review.entity").Review>;
    update(id: string, updateReviewDto: UpdateReviewDto, req: any): Promise<import("../entities/review.entity").Review>;
    remove(id: string, req: any): Promise<void>;
    addSellerResponse(id: string, sellerResponseDto: SellerResponseDto, req: any): Promise<import("../entities/review.entity").Review>;
    voteHelpful(id: string, voteDto: VoteReviewDto, req: any): Promise<{
        helpfulCount: number;
        notHelpfulCount: number;
    }>;
}
