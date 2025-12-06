import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryPartnerProfile } from 'db';
import { DeliveryPartnerKycDocument } from 'db';
import { TenantProvider } from '..//common/tenant.module';
import { UserService } from '..//user/user.service';
import { TrackingGateway } from '../tracking/tracking.gateway'; // Import TrackingGateway

@Injectable()
export class DeliveryPartnerService {
  constructor(
    @InjectRepository(DeliveryPartnerProfile)
    private readonly dpProfileRepository: Repository<DeliveryPartnerProfile>,
    @InjectRepository(DeliveryPartnerKycDocument)
    private readonly dpKycDocumentRepository: Repository<DeliveryPartnerKycDocument>,
    private readonly tenantProvider: TenantProvider,
    private readonly userService: UserService,
    private readonly trackingGateway: TrackingGateway, // Inject TrackingGateway
  ) {}

  private get tenantId(): string {
    const tenantId = this.tenantProvider.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing.');
    }
    return tenantId;
  }

  async registerDeliveryPartner(userId: string, profileData: Partial<DeliveryPartnerProfile>): Promise<DeliveryPartnerProfile> {
    const existingProfile = await this.dpProfileRepository.findOne({
      where: { userId, tenantId: this.tenantId },
    });
    if (existingProfile) {
      throw new ConflictException('Delivery partner profile already exists for this user.');
    }

    const user = await this.userService.findUserById(userId);
    if (!user) {
        throw new NotFoundException('User not found.');
    }
    await this.userService.updateUser(userId, { defaultPersona: 'delivery_partner' });

    const dpProfile = this.dpProfileRepository.create({
      ...profileData,
      userId,
      tenantId: this.tenantId,
      kycStatus: 'pending',
    });

    const savedProfile = await this.dpProfileRepository.save(dpProfile);
    return savedProfile;
  }

  async getDeliveryPartnerProfile(userId: string): Promise<DeliveryPartnerProfile> {
    const profile = await this.dpProfileRepository.findOne({
      where: { userId, tenantId: this.tenantId },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException('Delivery partner profile not found.');
    }
    return profile;
  }

  async updateDeliveryPartnerProfile(userId: string, profileData: Partial<DeliveryPartnerProfile>): Promise<DeliveryPartnerProfile> {
    const profile = await this.getDeliveryPartnerProfile(userId);
    this.dpProfileRepository.merge(profile, profileData);
    return this.dpProfileRepository.save(profile);
  }

  async updatePartnerStatus(userId: string, status: 'online' | 'offline' | 'on_delivery' | 'break'): Promise<DeliveryPartnerProfile> {
    const profile = await this.getDeliveryPartnerProfile(userId);
    profile.status = status;
    profile.lastLocationUpdateTime = new Date();
    const updatedProfile = await this.dpProfileRepository.save(profile);

    // Emit status update
    this.trackingGateway.emitDeliveryPartnerLocation(updatedProfile); // Reusing location update for status change
    return updatedProfile;
  }

  async updatePartnerLocation(userId: string, latitude: number, longitude: number): Promise<DeliveryPartnerProfile> {
    const profile = await this.getDeliveryPartnerProfile(userId);
    profile.currentLatitude = latitude;
    profile.currentLongitude = longitude;
    profile.lastLocationUpdateTime = new Date();
    const updatedProfile = await this.dpProfileRepository.save(profile);

    // Emit real-time location update
    this.trackingGateway.emitDeliveryPartnerLocation(updatedProfile);
    return updatedProfile;
  }

  async uploadKycDocument(userId: string, documentType: string, documentUrl: string): Promise<DeliveryPartnerKycDocument> {
    const profile = await this.getDeliveryPartnerProfile(userId);

    const existingDoc = await this.dpKycDocumentRepository.findOne({
        where: { userId, tenantId: this.tenantId, documentType }
    });
    if (existingDoc && existingDoc.status === 'pending') {
        throw new ConflictException(`A '${documentType}' document is already pending review.`);
    }

    if (existingDoc) {
        existingDoc.documentUrl = documentUrl;
        existingDoc.status = 'pending';
        existingDoc.rejectionReason = null;
        return this.dpKycDocumentRepository.save(existingDoc);
    } else {
        const kycDocument = this.dpKycDocumentRepository.create({
            userId,
            tenantId: this.tenantId,
            documentType,
            documentUrl,
            status: 'pending',
        });
        return this.dpKycDocumentRepository.save(kycDocument);
    }
  }

  async getKycDocuments(userId: string): Promise<DeliveryPartnerKycDocument[]> {
    return this.dpKycDocumentRepository.find({
      where: { userId, tenantId: this.tenantId },
    });
  }

  async reviewKycDocument(documentId: string, status: 'approved' | 'rejected', rejectionReason?: string): Promise<DeliveryPartnerKycDocument> {
    const document = await this.dpKycDocumentRepository.findOne({
      where: { id: documentId, tenantId: this.tenantId },
    });
    if (!document) {
      throw new NotFoundException('KYC document not found.');
    }
    document.status = status;
    document.rejectionReason = rejectionReason;
    const updatedDoc = await this.dpKycDocumentRepository.save(document);

    const allDocs = await this.dpKycDocumentRepository.find({
        where: { userId: document.userId, tenantId: this.tenantId }
    });
    const allApproved = allDocs.every(doc => doc.status === 'approved');

    if (allApproved) {
        const dpProfile = await this.dpProfileRepository.findOne({ where: { userId: document.userId, tenantId: this.tenantId } });
        if (dpProfile && dpProfile.kycStatus === 'pending') {
            dpProfile.kycStatus = 'approved';
            await this.dpProfileRepository.save(dpProfile);
        }
    }
    return updatedDoc;
  }

  async getPendingDeliveryPartnerApprovals(): Promise<DeliveryPartnerProfile[]> {
    return this.dpProfileRepository.find({
      where: { kycStatus: 'pending', tenantId: this.tenantId },
      relations: ['user'],
    });
  }

  async approveDeliveryPartner(profileId: string): Promise<DeliveryPartnerProfile> {
    const profile = await this.dpProfileRepository.findOne({
      where: { id: profileId, tenantId: this.tenantId },
    });
    if (!profile) {
      throw new NotFoundException('Delivery partner profile not found.');
    }
    profile.kycStatus = 'approved';
    return this.dpProfileRepository.save(profile);
  }
}
