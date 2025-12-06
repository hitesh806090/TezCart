import { Entity, Column, ManyToOne, OneToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ReturnRequest } from './return-request.entity';
import { DeliveryPartnerProfile } from './delivery-partner-profile.entity';

@Entity('return_pickup_tasks')
@Index(['returnRequestId', 'tenantId'], { unique: true }) // One pickup task per return request
@Index(['deliveryPartnerId', 'status', 'tenantId'])
export class ReturnPickupTask extends BaseEntity {
  @Column({ name: 'return_request_id', nullable: false })
  returnRequestId: string;

  @OneToOne(() => ReturnRequest, returnRequest => returnRequest.id)
  @JoinColumn({ name: 'return_request_id' })
  returnRequest: ReturnRequest;

  @Column({ name: 'delivery_partner_id', nullable: true })
  deliveryPartnerId: string;

  @ManyToOne(() => DeliveryPartnerProfile, dp => dp.id)
  @JoinColumn({ name: 'delivery_partner_id' })
  deliveryPartner: DeliveryPartnerProfile;

  @Column({ nullable: false, default: 'pending_assignment' })
  status: string; // e.g., 'pending_assignment', 'assigned', 'accepted', 'picked_up', 'failed'

  @Column({ type: 'jsonb', nullable: true })
  pickupLocation: object; // Customer's address where item needs to be picked from

  @Column({ type: 'timestamp', nullable: true })
  assignedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  acceptedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  pickedUpAt: Date;

  @Column({ type: 'text', nullable: true })
  failureReason: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: object; // Additional task-related info (e.g., customer contact, item details)
}
