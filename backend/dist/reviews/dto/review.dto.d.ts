export declare class CreateReviewDto {
    rating: number;
    title?: string;
    comment: string;
    images?: string[];
}
export declare class UpdateReviewDto {
    rating?: number;
    title?: string;
    comment?: string;
    images?: string[];
}
export declare class SellerResponseDto {
    response: string;
}
export declare class VoteReviewDto {
    isHelpful: boolean;
}
export declare class ReviewQueryDto {
    page?: number;
    limit?: number;
    rating?: number;
    verifiedPurchaseOnly?: boolean;
    sortBy?: 'helpful' | 'recent' | 'rating_high' | 'rating_low';
}
