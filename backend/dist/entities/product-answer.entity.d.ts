import { User } from './user.entity';
import { ProductQuestion } from './product-question.entity';
export declare class ProductAnswer {
    id: string;
    question: ProductQuestion;
    questionId: string;
    user: User;
    userId: string;
    answer: string;
    isSellerAnswer: boolean;
    isVerifiedPurchase: boolean;
    helpfulCount: number;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}
