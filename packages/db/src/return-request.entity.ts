import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Order } from './order.entity';
import { ReturnItem } from './return-item.entity';

@Entity('return_requests')
@Index(['userId', 'orderId', 'tenantId'])
export class ReturnRequest extends BaseEntity {
  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'order_id', nullable: false })
  orderId: string; // The parent order for which return is requested

  @ManyToOne(() => Order, order => order.id)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'return_reason_id', nullable: true })
  returnReasonId: string; // Link to a predefined return reason

  @Column({ type: 'text', nullable: true })
  customerComment: string;

  @Column({ nullable: false, default: 'pending' })
  status: string; // e.g., 'pending', 'approved', 'rejected', 'pickup_scheduled', 'received', 'refunded', 'replaced'

  @Column({ nullable: false })
  requestType: string; // 'refund', 'replacement'

  @Column({ type: 'jsonb', nullable: true })
  proofImageUrls: string[]; // URLs of images uploaded by customer

  @Column({ type: 'timestamp', nullable: true })
  resolutionDate: Date;

  @Column({ type: 'text', nullable: true })
  resolutionComment: string; // Admin/seller comment on resolution

  @OneToMany(() => ReturnItem, returnItem => returnItem.returnRequest)
  items: ReturnItem[];
}
