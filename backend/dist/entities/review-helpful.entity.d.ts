import { User } from './user.entity';
import { Review } from './review.entity';
export declare class ReviewHelpfulVote {
    id: string;
    user: User;
    userId: string;
    review: Review;
    reviewId: string;
    isHelpful: boolean;
    createdAt: Date;
}
