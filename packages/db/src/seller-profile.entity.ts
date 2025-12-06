import { Entity, Column, OneToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('seller_profiles')
@Index(['userId', 'tenantId'], { unique: true })
export class SellerProfile extends BaseEntity {
  @Column({ name: 'user_id', nullable: false })
  userId: string; // The user who is the seller

  @OneToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ unique: true, nullable: false })
  storeName: string;

  @Column({ unique: true, nullable: false })
  storeSlug: string; // URL-friendly identifier for the store

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ nullable: true })
  gstin: string; // GST Identification Number (India specific)

  @Column({ nullable: true })
  pan: string; // Permanent Account Number (India specific)

  @Column({ nullable: true })
  bankAccountName: string;

  @Column({ nullable: true })
  bankAccountNumber: string;

  @Column({ nullable: true })
  ifscCode: string;

  @Column({ nullable: false, default: 'pending' })
  status: string; // e.g., 'pending', 'approved', 'rejected', 'suspended'

  @Column({ type: 'jsonb', nullable: true })
  address: object; // Store full business address

  @Column({ type: 'jsonb', nullable: true })
  kycDetails: object; // Metadata about KYC (e.g., reason for rejection)

  @Column({ default: 0 })
  reliabilityScore: number; // For future use
}
