import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Cart } from './cart.entity';
import { Product } from './product.entity';
import { User } from './user.entity'; // To represent the seller

@Entity('cart_items')
@Index(['cartId', 'productId', 'tenantId', 'sellerId'], { unique: true }) // Unique product/seller combination per cart
export class CartItem extends BaseEntity {
  @Column({ name: 'cart_id', nullable: false })
  cartId: string;

  @ManyToOne(() => Cart, cart => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @Column({ name: 'product_id', nullable: false })
  productId: string;

  @ManyToOne(() => Product, product => product.id)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'seller_id', nullable: false })
  sellerId: string; // The seller of the product

  @ManyToOne(() => User, user => user.id) // Assuming User entity is also used for Seller
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number; // Price at the time of adding to cart

  @Column({ type: 'jsonb', nullable: true })
  attributes: object; // e.g., { color: 'red', size: 'M' } - for variant selection
}
