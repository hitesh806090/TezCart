import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ProductQuestion } from './product-question.entity';

@Entity('product_answers')
export class ProductAnswer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => ProductQuestion, question => question.answers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'questionId' })
    question: ProductQuestion;

    @Column()
    questionId: string;

    @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ nullable: true })
    userId: string;

    @Column({ type: 'text' })
    answer: string;

    @Column({ default: false })
    isSellerAnswer: boolean; // Answer from product seller

    @Column({ default: false })
    isVerifiedPurchase: boolean;

    @Column({ default: 0 })
    helpfulCount: number;

    @Column({ default: true })
    isPublished: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
