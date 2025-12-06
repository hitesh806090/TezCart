import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity'; // The user who answered (seller/admin)
import { ProductQuestion } from './product-question.entity';

@Entity('product_answers')
@Index(['questionId', 'tenantId'])
@Index(['userId', 'tenantId'])
export class ProductAnswer extends BaseEntity {
  @Column({ name: 'question_id', nullable: false })
  questionId: string;

  @ManyToOne(() => ProductQuestion, question => question.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: ProductQuestion;

  @Column({ name: 'user_id', nullable: false })
  userId: string; // The user who provided the answer (seller, admin, or even another customer)

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text', nullable: false })
  answer: string;

  @Column({ nullable: false, default: 'pending' })
  status: string; // 'pending', 'published', 'rejected'

  @Column({ type: 'int', nullable: false, default: 0 })
  upvoteCount: number; // For helpfulness
}
