import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Wishlist } from './wishlist.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('wishlist_items')
export class WishlistItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Wishlist, (wishlist) => wishlist.items, { onDelete: 'CASCADE' })
  wishlist: Wishlist;

  @Column()
  wishlistId: string;

  @ManyToOne(() => Product)
  product: Product;

  @Column()
  productId: string;

  @CreateDateColumn()
  addedAt: Date;
}
