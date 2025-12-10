import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Index,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';
import { ProductAnswer } from './product-answer.entity';

@Entity('product_questions')
@Index(['productId', 'isPublished'])
export class ProductQuestion {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Product, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column()
    productId: string;

    @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ nullable: true })
    userId: string;

    @Column({ type: 'text' })
    question: string;

    @OneToMany(() => ProductAnswer, answer => answer.question)
    answers: ProductAnswer[];

    @Column({ default: 0 })
    answerCount: number;

    @Column({ default: 0 })
    helpfulCount: number;

    @Column({ default: true })
    isPublished: boolean;

    @Column({ default: false })
    hasAnswer: boolean; // Quick check if question has any answers

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
