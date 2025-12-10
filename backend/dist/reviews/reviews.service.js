"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const review_entity_1 = require("../entities/review.entity");
const review_helpful_entity_1 = require("../entities/review-helpful.entity");
const product_entity_1 = require("../entities/product.entity");
let ReviewsService = class ReviewsService {
    reviewsRepository;
    votesRepository;
    productsRepository;
    constructor(reviewsRepository, votesRepository, productsRepository) {
        this.reviewsRepository = reviewsRepository;
        this.votesRepository = votesRepository;
        this.productsRepository = productsRepository;
    }
    async create(productId, createReviewDto, userId) {
        const product = await this.productsRepository.findOne({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const existing = await this.reviewsRepository.findOne({
            where: { productId, userId },
        });
        if (existing) {
            throw new common_1.ConflictException('You have already reviewed this product');
        }
        const isVerifiedPurchase = false;
        const review = this.reviewsRepository.create({
            ...createReviewDto,
            productId,
            userId,
            isVerifiedPurchase,
        });
        const savedReview = await this.reviewsRepository.save(review);
        await this.updateProductRating(productId);
        return savedReview;
    }
    async findAllByProduct(productId, query) {
        const { page = 1, limit = 20, rating, verifiedPurchaseOnly, sortBy = 'helpful' } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.reviewsRepository
            .createQueryBuilder('review')
            .leftJoinAndSelect('review.user', 'user')
            .where('review.productId = :productId', { productId })
            .andWhere('review.isApproved = :isApproved', { isApproved: true });
        if (rating) {
            queryBuilder.andWhere('review.rating = :rating', { rating });
        }
        if (verifiedPurchaseOnly) {
            queryBuilder.andWhere('review.isVerifiedPurchase = :isVerified', { isVerified: true });
        }
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
        queryBuilder.skip(skip).take(limit);
        const [data, total] = await queryBuilder.getManyAndCount();
        const stats = await this.getProductRatingStats(productId);
        return {
            data,
            total,
            averageRating: stats.averageRating,
            ratingDistribution: stats.ratingDistribution,
        };
    }
    async findOne(id) {
        const review = await this.reviewsRepository.findOne({
            where: { id },
            relations: ['user', 'product'],
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        return review;
    }
    async update(id, updateReviewDto, userId) {
        const review = await this.findOne(id);
        if (review.userId !== userId) {
            throw new common_1.ForbiddenException('You can only edit your own reviews');
        }
        Object.assign(review, updateReviewDto);
        const updatedReview = await this.reviewsRepository.save(review);
        if (updateReviewDto.rating) {
            await this.updateProductRating(review.productId);
        }
        return updatedReview;
    }
    async remove(id, userId, userRole) {
        const review = await this.findOne(id);
        if (review.userId !== userId && userRole !== 'admin') {
            throw new common_1.ForbiddenException('You cannot delete this review');
        }
        const productId = review.productId;
        await this.reviewsRepository.remove(review);
        await this.updateProductRating(productId);
    }
    async addSellerResponse(id, sellerResponseDto, userId) {
        const review = await this.reviewsRepository.findOne({
            where: { id },
            relations: ['product', 'product.seller'],
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        if (review.product.sellerId !== userId) {
            throw new common_1.ForbiddenException('Only the product seller can respond to reviews');
        }
        review.sellerResponse = sellerResponseDto.response;
        review.sellerResponseDate = new Date();
        return this.reviewsRepository.save(review);
    }
    async voteHelpful(reviewId, voteDto, userId) {
        const review = await this.findOne(reviewId);
        const existingVote = await this.votesRepository.findOne({
            where: { reviewId, userId },
        });
        if (existingVote) {
            if (existingVote.isHelpful !== voteDto.isHelpful) {
                if (existingVote.isHelpful) {
                    review.helpfulCount = Math.max(0, review.helpfulCount - 1);
                    review.notHelpfulCount += 1;
                }
                else {
                    review.notHelpfulCount = Math.max(0, review.notHelpfulCount - 1);
                    review.helpfulCount += 1;
                }
                existingVote.isHelpful = voteDto.isHelpful;
                await this.votesRepository.save(existingVote);
            }
        }
        else {
            const vote = this.votesRepository.create({
                reviewId,
                userId,
                isHelpful: voteDto.isHelpful,
            });
            await this.votesRepository.save(vote);
            if (voteDto.isHelpful) {
                review.helpfulCount += 1;
            }
            else {
                review.notHelpfulCount += 1;
            }
        }
        await this.reviewsRepository.save(review);
        return {
            helpfulCount: review.helpfulCount,
            notHelpfulCount: review.notHelpfulCount,
        };
    }
    async updateProductRating(productId) {
        const stats = await this.getProductRatingStats(productId);
        await this.productsRepository.update({ id: productId }, {
            averageRating: stats.averageRating,
            totalReviews: stats.totalReviews,
        });
    }
    async getProductRatingStats(productId) {
        const reviews = await this.reviewsRepository.find({
            where: { productId, isApproved: true },
            select: ['rating'],
        });
        const totalReviews = reviews.length;
        const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
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
    async getMyReviews(userId, page = 1, limit = 20) {
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
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __param(1, (0, typeorm_1.InjectRepository)(review_helpful_entity_1.ReviewHelpfulVote)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map