import { Entity, Column, OneToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { CartItem } from './cart-item.entity';

@Entity('carts')
@Index(['userId', 'tenantId'], { unique: true, where: '"userId" IS NOT NULL' }) // One cart per user per tenant
@Index(['sessionId', 'tenantId'], { unique: true, where: '"sessionId" IS NOT NULL' }) // One cart per guest session per tenant
export class Cart extends BaseEntity {
  @Column({ name: 'user_id', nullable: true })
  userId: string; // Null for guest users

  @OneToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'session_id', nullable: true })
  sessionId: string; // Identifier for guest users

  @OneToMany(() => CartItem, cartItem => cartItem.cart)
  items: CartItem[];
}
