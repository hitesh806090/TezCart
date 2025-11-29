import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
import { SellerStatus } from './seller-status.enum';

@Entity('sellers')
export class Seller {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  storeName: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  gstin: string;

  @Column({ nullable: true })
  pickupAddress: string;

  @Column({
    type: 'enum',
    enum: SellerStatus,
    default: SellerStatus.PENDING,
  })
  status: SellerStatus;

  @OneToOne(() => User, (user) => user.sellerProfile)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => Product, (product) => product.seller)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
