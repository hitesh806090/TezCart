import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { User } from './user.entity';
import { Review } from './review.entity';

@Entity('review_helpful_votes')
@Index(['userId', 'reviewId'], { unique: true }) // One vote per user per review
export class ReviewHelpfulVote {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    @ManyToOne(() => Review, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'reviewId' })
    review: Review;

    @Column()
    reviewId: string;

    @Column({ type: 'boolean' })
    isHelpful: boolean; // true = helpful, false = not helpful

    @CreateDateColumn()
    createdAt: Date;
}
