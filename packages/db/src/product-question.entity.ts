import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity'; // The user who asked the question
import { Product } from './product.entity';
import { ProductAnswer } from './product-answer.entity';

@Entity('product_questions')
@Index(['productId', 'tenantId'])
@Index(['userId', 'tenantId'])
export class ProductQuestion extends BaseEntity {
  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'product_id', nullable: false })
  productId: string;

  @ManyToOne(() => Product, product => product.id)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'text', nullable: false })
  question: string;

  @Column({ nullable: false, default: 'pending' })
  status: string; // 'pending', 'published', 'rejected'

  @Column({ type: 'int', nullable: false, default: 0 })
  upvoteCount: number; // For helpfulness

  @OneToMany(() => ProductAnswer, answer => answer.question)
  answers: ProductAnswer[];
}
