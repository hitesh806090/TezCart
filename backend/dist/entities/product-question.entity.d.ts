import { User } from './user.entity';
import { Product } from './product.entity';
import { ProductAnswer } from './product-answer.entity';
export declare class ProductQuestion {
    id: string;
    product: Product;
    productId: string;
    user: User;
    userId: string;
    question: string;
    answers: ProductAnswer[];
    answerCount: number;
    helpfulCount: number;
    isPublished: boolean;
    hasAnswer: boolean;
    createdAt: Date;
    updatedAt: Date;
}
