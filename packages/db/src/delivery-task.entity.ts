import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Order } from './order.entity'; // The child order to be delivered
import { DeliveryPartnerProfile } from './delivery-partner-profile.entity';

@Entity('delivery_tasks')
@Index(['orderId', 'tenantId'], { unique: true }) // One delivery task per child order
@Index(['deliveryPartnerId', 'status', 'tenantId'])
export class DeliveryTask extends BaseEntity {
  @Column({ name: 'order_id', nullable: false })
  orderId: string; // The ID of the child order to be delivered

  @OneToOne(() => Order, order => order.id)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'delivery_partner_id', nullable: true })
  deliveryPartnerId: string; // The ID of the assigned delivery partner

  @ManyToOne(() => DeliveryPartnerProfile, dp => dp.id)
  @JoinColumn({ name: 'delivery_partner_id' })
  deliveryPartner: DeliveryPartnerProfile;

  @Column({ nullable: false, default: 'pending_assignment' })
  status: string; // e.g., 'pending_assignment', 'assigned', 'accepted', 'declined', 'picked_up', 'delivered', 'failed'

  @Column({ type: 'jsonb', nullable: true })
  pickupLocation: object; // Snapshot of seller's location

  @Column({ type: 'jsonb', nullable: true })
  deliveryLocation: object; // Snapshot of customer's location

  @Column({ type: 'timestamp', nullable: true })
  assignedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  acceptedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  pickedUpAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt: Date;

  @Column({ type: 'text', nullable: true })
  failureReason: string;

  @Column({ nullable: true })
  otp: string; // OTP for delivery confirmation

  @Column({ nullable: false, default: false })
  isOtpVerified: boolean;

  @Column({ type: 'jsonb', nullable: true })
  proofPhotoUrls: string[]; // URLs of photos taken as proof of delivery

  @Column({ nullable: true })
  customerSignatureUrl: string; // URL of customer's signature

  @Column({ type: 'jsonb', nullable: true })
  metadata: object; // Additional task-related info (e.g., customer contact)
}