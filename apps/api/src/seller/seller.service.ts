import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SellerProfile } from 'db';
import { SellerKycDocument } from 'db';
import { TenantProvider } from '..//common/tenant.module';
import { UserService } from '..//user/user.service'; // To update user persona

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(SellerProfile)
    private readonly sellerProfileRepository: Repository<SellerProfile>,
    @InjectRepository(SellerKycDocument)
    private readonly sellerKycDocumentRepository: Repository<SellerKycDocument>,
    private readonly tenantProvider: TenantProvider,
    private readonly userService: UserService,
  ) {}

  private get tenantId(): string {
    const tenantId = this.tenantProvider.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing.');
    }
    return tenantId;
  }

  async registerSeller(userId: string, profileData: Partial<SellerProfile>): Promise<SellerProfile> {
    // 1. Check if user already has a seller profile for this tenant
    const existingProfile = await this.sellerProfileRepository.findOne({
      where: { userId, tenantId: this.tenantId },
    });
    if (existingProfile) {
      throw new ConflictException('Seller profile already exists for this user.');
    }

    // 2. Validate user and ensure they are not already a seller (or switch persona)
    const user = await this.userService.findUserById(userId);
    if (!user) {
        throw new NotFoundException('User not found.');
    }
    // Update user's default persona to 'seller'
    await this.userService.updateUser(userId, { defaultPersona: 'seller' });

    // 3. Create seller profile
    const sellerProfile = this.sellerProfileRepository.create({
      ...profileData,
      userId,
      tenantId: this.tenantId,
      status: 'pending', // Initial status
      storeSlug: profileData.storeSlug || this.generateStoreSlug(profileData.storeName),
    });

    const savedProfile = await this.sellerProfileRepository.save(sellerProfile);
    return savedProfile;
  }

  async getSellerProfile(userId: string): Promise<SellerProfile> {
    const profile = await this.sellerProfileRepository.findOne({
      where: { userId, tenantId: this.tenantId },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException('Seller profile not found.');
    }
    return profile;
  }

  async updateSellerProfile(userId: string, profileData: Partial<SellerProfile>): Promise<SellerProfile> {
    const profile = await this.getSellerProfile(userId); // Ensures profile exists and belongs to user/tenant
    this.sellerProfileRepository.merge(profile, profileData);
    return this.sellerProfileRepository.save(profile);
  }

  async uploadKycDocument(userId: string, documentType: string, documentUrl: string): Promise<SellerKycDocument> {
    const profile = await this.getSellerProfile(userId); // Ensure seller profile exists

    const existingDoc = await this.sellerKycDocumentRepository.findOne({
        where: { userId, tenantId: this.tenantId, documentType }
    });
    if (existingDoc && existingDoc.status === 'pending') {
        throw new ConflictException(`A '${documentType}' document is already pending review.`);
    }

    // For simplicity, overwrite existing doc if rejected or approved
    if (existingDoc) {
        existingDoc.documentUrl = documentUrl;
        existingDoc.status = 'pending';
        existingDoc.rejectionReason = null;
        return this.sellerKycDocumentRepository.save(existingDoc);
    } else {
        const kycDocument = this.sellerKycDocumentRepository.create({
            userId,
            tenantId: this.tenantId,
            documentType,
            documentUrl,
            status: 'pending',
        });
        return this.sellerKycDocumentRepository.save(kycDocument);
    }
  }

  async getKycDocuments(userId: string): Promise<SellerKycDocument[]> {
    return this.sellerKycDocumentRepository.find({
      where: { userId, tenantId: this.tenantId },
    });
  }

  // Admin methods for approving/rejecting KYC documents and seller profiles
  async reviewKycDocument(documentId: string, status: 'approved' | 'rejected', rejectionReason?: string): Promise<SellerKycDocument> {
    const document = await this.sellerKycDocumentRepository.findOne({
      where: { id: documentId, tenantId: this.tenantId },
    });
    if (!document) {
      throw new NotFoundException('KYC document not found.');
    }
    document.status = status;
    document.rejectionReason = rejectionReason;
    const updatedDoc = await this.sellerKycDocumentRepository.save(document);

    // If all KYC docs are approved, and seller profile is pending, update seller profile status
    const allDocs = await this.sellerKycDocumentRepository.find({
        where: { userId: document.userId, tenantId: this.tenantId }
    });
    const allApproved = allDocs.every(doc => doc.status === 'approved');

    if (allApproved) {
        const sellerProfile = await this.sellerProfileRepository.findOne({ where: { userId: document.userId, tenantId: this.tenantId } });
        if (sellerProfile && sellerProfile.status === 'pending') {
            sellerProfile.status = 'approved';
            await this.sellerProfileRepository.save(sellerProfile);
        }
    }
    return updatedDoc;
  }

  async getPendingSellerApprovals(): Promise<SellerProfile[]> {
    return this.sellerProfileRepository.find({
      where: { status: 'pending', tenantId: this.tenantId },
      relations: ['user'],
    });
  }

  async approveSellerProfile(sellerProfileId: string): Promise<SellerProfile> {
    const profile = await this.sellerProfileRepository.findOne({
      where: { id: sellerProfileId, tenantId: this.tenantId },
    });
    if (!profile) {
      throw new NotFoundException('Seller profile not found.');
    }
    profile.status = 'approved';
    return this.sellerProfileRepository.save(profile);
  }

  async rejectSellerProfile(sellerProfileId: string, reason: string): Promise<SellerProfile> {
    const profile = await this.sellerProfileRepository.findOne({
      where: { id: sellerProfileId, tenantId: this.tenantId },
    });
    if (!profile) {
      throw new NotFoundException('Seller profile not found.');
    }
    profile.status = 'rejected';
    (profile.kycDetails as any).rejectionReason = reason; // Store reason in kycDetails for now
    return this.sellerProfileRepository.save(profile);
  }


  private generateStoreSlug(storeName: string): string {
    return storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');
  }
}