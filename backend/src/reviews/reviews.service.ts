import { Injectable, NotFoundException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { ReviewHelpfulVote } from '../entities/review-helpful.entity';
import { Product } from '../entities/product.entity';
import { CreateReviewDto, UpdateReviewDto, ReviewQueryDto, SellerResponseDto, VoteReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private reviewsRepository: Repository<Review>,
        @InjectRepository(ReviewHelpfulVote)
        private votesRepository: Repository<ReviewHelpfulVote>,
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) { }

    async create(
        productId: string,
        createReviewDto: CreateReviewDto,
        userId: string,
    ): Promise<Review> {
        // Check if product exists
        const product = await this.productsRepository.findOne({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Check if user already reviewed this product
        const existing = await this.reviewsRepository.findOne({
            where: { productId, userId },
        });

        if (existing) {
            throw new ConflictException('You have already reviewed this product');
        }

        // TODO: Check if user purchased this product (isVerifiedPurchase)
        // This would require checking order history
        const isVerifiedPurchase = false; // Placeholder

        const review = this.reviewsRepository.create({
            ...createReviewDto,
            productId,
            userId,
            isVerifiedPurchase,
        });

        const savedReview = await this.reviewsRepository.save(review);

        // Update product rating statistics
        await this.updateProductRating(productId);

        return savedReview;
    }

    async findAllByProduct(
        productId: string,
        query: ReviewQueryDto,
    ): Promise<{ data: Review[]; total: number; averageRating: number; ratingDistribution: any }> {
        const { page = 1, limit = 20, rating, verifiedPurchaseOnly, sortBy = 'helpful' } = query;
        const skip = (page - 1) * limit;

        const queryBuilder = this.reviewsRepository
            .createQueryBuilder('review')
            .leftJoinAndSelect('review.user', 'user')
            .where('review.productId = :productId', { productId })
            .andWhere('review.isApproved = :isApproved', { isApproved: true });

        // Filters
        if (rating) {
            queryBuilder.andWhere('review.rating = :rating', { rating });
        }

        if (verifiedPurchaseOnly) {
            queryBuilder.andWhere('review.isVerifiedPurchase = :isVerified', { isVerified: true });
        }

        // Sorting
        switch (sortBy) {
            case 'helpful':
                queryBuilder.orderBy('review.helpfulCount', 'DESC');
                break;
            case 'recent':
                queryBuilder.orderBy('review.createdAt', 'DESC');
                break;
            case 'rating_high':
                queryBuilder.orderBy('review.rating', 'DESC');
                break;
            case 'rating_low':
                queryBuilder.orderBy('review.rating', 'ASC');
                break;
        }

        // Pagination
        queryBuilder.skip(skip).take(limit);

        const [data, total] = await queryBuilder.getManyAndCount();

        // Calculate average rating and distribution
        const stats = await this.getProductRatingStats(productId);

        return {
            data,
            total,
            averageRating: stats.averageRating,
            ratingDistribution: stats.ratingDistribution,
        };
    }

    async findOne(id: string): Promise<Review> {
        const review = await this.reviewsRepository.findOne({
            where: { id },
            relations: ['user', 'product'],
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        return review;
    }

    async update(
        id: string,
        updateReviewDto: UpdateReviewDto,
        userId: string,
    ): Promise<Review> {
        const review = await this.findOne(id);

        if (review.userId !== userId) {
            throw new ForbiddenException('You can only edit your own reviews');
        }

        Object.assign(review, updateReviewDto);
        const updatedReview = await this.reviewsRepository.save(review);

        // Update product rating if rating changed
        if (updateReviewDto.rating) {
            await this.updateProductRating(review.productId);
        }

        return updatedReview;
    }

    async remove(id: string, userId: string, userRole: string): Promise<void> {
        const review = await this.findOne(id);

        // Only review owner or admin can delete
        if (review.userId !== userId && userRole !== 'admin') {
            throw new ForbiddenException('You cannot delete this review');
        }

        const productId = review.productId;
        await this.reviewsRepository.remove(review);

        // Update product rating
        await this.updateProductRating(productId);
    }

    async addSellerResponse(
        id: string,
        sellerResponseDto: SellerResponseDto,
        userId: string,
    ): Promise<Review> {
        const review = await this.reviewsRepository.findOne({
            where: { id },
            relations: ['product', 'product.seller'],
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        // Check if user is the product seller
        if (review.product.sellerId !== userId) {
            throw new ForbiddenException('Only the product seller can respond to reviews');
        }

        review.sellerResponse = sellerResponseDto.response;
        review.sellerResponseDate = new Date();

        return this.reviewsRepository.save(review);
    }

    async voteHelpful(
        reviewId: string,
        voteDto: VoteReviewDto,
        userId: string,
    ): Promise<{ helpfulCount: number; notHelpfulCount: number }> {
        const review = await this.findOne(reviewId);

        // Check if user already voted
        const existingVote = await this.votesRepository.findOne({
            where: { reviewId, userId },
        });

        if (existingVote) {
            // Update existing vote
            if (existingVote.isHelpful !== voteDto.isHelpful) {
                // Switching vote
                if (existingVote.isHelpful) {
                    review.helpfulCount = Math.max(0, review.helpfulCount - 1);
                    review.notHelpfulCount += 1;
                } else {
                    review.notHelpfulCount = Math.max(0, review.notHelpfulCount - 1);
                    review.helpfulCount += 1;
                }

                existingVote.isHelpful = voteDto.isHelpful;
                await this.votesRepository.save(existingVote);
            }
        } else {
            // New vote
            const vote = this.votesRepository.create({
                reviewId,
                userId,
                isHelpful: voteDto.isHelpful,
            });

            await this.votesRepository.save(vote);

            if (voteDto.isHelpful) {
                review.helpfulCount += 1;
            } else {
                review.notHelpfulCount += 1;
            }
        }

        await this.reviewsRepository.save(review);

        return {
            helpfulCount: review.helpfulCount,
            notHelpfulCount: review.notHelpfulCount,
        };
    }

    private async updateProductRating(productId: string): Promise<void> {
        const stats = await this.getProductRatingStats(productId);

        await this.productsRepository.update(
            { id: productId },
            {
                averageRating: stats.averageRating,
                totalReviews: stats.totalReviews,
            },
        );
    }

    private async getProductRatingStats(productId: string): Promise<{
        averageRating: number;
        totalReviews: number;
        ratingDistribution: Record<number, number>;
    }> {
        const reviews = await this.reviewsRepository.find({
            where: { productId, isApproved: true },
            select: ['rating'],
        });

        const totalReviews = reviews.length;
        const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

        if (totalReviews === 0) {
            return {
                averageRating: 0,
                totalReviews: 0,
                ratingDistribution,
            };
        }

        let totalRating = 0;
        reviews.forEach((review) => {
            totalRating += review.rating;
            ratingDistribution[review.rating]++;
        });

        const averageRating = Math.round((totalRating / totalReviews) * 100) / 100;

        return {
            averageRating,
            totalReviews,
            ratingDistribution,
        };
    }

    async getMyReviews(
        userId: string,
        page: number = 1,
        limit: number = 20,
    ): Promise<{ data: Review[]; total: number }> {
        const skip = (page - 1) * limit;

        const [data, total] = await this.reviewsRepository.findAndCount({
            where: { userId },
            relations: ['product'],
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
        });

        return { data, total };
    }
}
