import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Seller } from '../../sellers/entities/seller.entity';
import { Order } from '../../orders/entities/order.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { Wishlist } from '../../wishlist/entities/wishlist.entity';

export enum UserRole {
  CUSTOMER = 'customer',
  SELLER = 'seller',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // hashed

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @OneToOne(() => Seller, (seller) => seller.user, { nullable: true })
  sellerProfile: Seller;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @OneToOne(() => Cart, (cart) => cart.user, { nullable: true })
  cart: Cart;

  @OneToOne(() => Wishlist, (wishlist) => wishlist.user, { nullable: true })
  wishlist: Wishlist;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
