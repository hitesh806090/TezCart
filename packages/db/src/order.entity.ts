import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity'; // For buyer and seller
import { Address } from './address.entity';
import { ShippingMethod } from './shipping-method.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
@Index(['userId', 'tenantId'])
@Index(['sellerId', 'tenantId'], { unique: false, where: '"sellerId" IS NOT NULL' }) // Seller ID only for sub-orders
export class Order extends BaseEntity {
  @Column({ name: 'order_code', unique: true, nullable: false })
  orderCode: string; // Human-readable order ID

  @Column({ name: 'user_id', nullable: false })
  userId: string; // Buyer ID

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User; // Buyer

  @Column({ name: 'parent_order_id', nullable: true })
  parentOrderId: string; // For multi-seller orders, links to the main order

  @OneToMany(() => Order, order => order.parentOrder)
  childOrders: Order[];

  @ManyToOne(() => Order, order => order.childOrders)
  @JoinColumn({ name: 'parent_order_id' })
  parentOrder: Order;

  @Column({ name: 'seller_id', nullable: true })
  sellerId: string; // Null for parent order, specific seller ID for child orders

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @Column({ name: 'shipping_address_id', nullable: false })
  shippingAddressId: string;

  @ManyToOne(() => Address, address => address.id)
  @JoinColumn({ name: 'shipping_address_id' })
  shippingAddress: Address;

  @Column({ name: 'shipping_method_id', nullable: false })
  shippingMethodId: string;

  @ManyToOne(() => ShippingMethod, method => method.id)
  @JoinColumn({ name: 'shipping_method_id' })
  shippingMethod: ShippingMethod;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  subTotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, default: 0 })
  shippingCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, default: 0 })
  totalAmount: number;

  @Column({ nullable: false, default: 'pending_payment' })
  status: string; // e.g., 'pending_payment', 'pending_confirmation', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  items: OrderItem[];

  @Column({ type: 'timestamp', nullable: true })
  expectedDeliveryDate: Date;
}
