import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { SellerService } from './seller.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { User } from 'db';

class RegisterSellerDto {
  storeName: string;
  storeSlug?: string;
  description?: string;
  logoUrl?: string;
  gstin?: string;
  pan?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
  address?: object;
}

class UpdateSellerProfileDto {
  storeName?: string;
  description?: string;
  logoUrl?: string;
  gstin?: string;
  pan?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
  address?: object;
}

class UploadKycDocumentDto {
  documentType: string; // e.g., 'aadhaar', 'pan', 'gstin_certificate'
  documentUrl: string; // S3 or similar storage URL
}

class ReviewKycDocumentDto {
  status: 'approved' | 'rejected';
  rejectionReason?: string;
}

class RejectSellerProfileDto {
  reason: string;
}

@ApiTags('Seller')
@Controller('seller')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // All seller operations require authentication
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  // Initially, any authenticated user can register as a seller
  registerSeller(@Body() registerSellerDto: RegisterSellerDto, @Request() req: { user: User }) {
    return this.sellerService.registerSeller(req.user.id, registerSellerDto);
  }

  @Get('profile')
  @UseGuards(RolesGuard)
  @Roles('seller', 'admin', 'super_admin') // Only seller or admin can view profile
  getSellerProfile(@Request() req: { user: User }) {
    return this.sellerService.getSellerProfile(req.user.id);
  }

  @Put('profile')
  @UseGuards(RolesGuard)
  @Roles('seller') // Only seller can update their own profile
  updateSellerProfile(@Body() updateSellerDto: UpdateSellerProfileDto, @Request() req: { user: User }) {
    return this.sellerService.updateSellerProfile(req.user.id, updateSellerDto);
  }

  @Post('kyc/upload')
  @UseGuards(RolesGuard)
  @Roles('seller') // Only seller can upload KYC documents
  uploadKycDocument(@Body() uploadKycDto: UploadKycDocumentDto, @Request() req: { user: User }) {
    return this.sellerService.uploadKycDocument(req.user.id, uploadKycDto.documentType, uploadKycDto.documentUrl);
  }

  @Get('kyc/documents')
  @UseGuards(RolesGuard)
  @Roles('seller') // Seller can view their own KYC documents
  getKycDocuments(@Request() req: { user: User }) {
    return this.sellerService.getKycDocuments(req.user.id);
  }

  // --- Admin Endpoints for Seller Management ---
  @Get('admin/pending-approvals')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  getPendingSellerApprovals() {
    return this.sellerService.getPendingSellerApprovals();
  }

  @Put('admin/kyc/:documentId/review')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  reviewKycDocument(@Param('documentId') documentId: string, @Body() reviewDto: ReviewKycDocumentDto) {
    return this.sellerService.reviewKycDocument(documentId, reviewDto.status, reviewDto.rejectionReason);
  }

  @Put('admin/profile/:profileId/approve')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  approveSellerProfile(@Param('profileId') profileId: string) {
    return this.sellerService.approveSellerProfile(profileId);
  }

  @Put('admin/profile/:profileId/reject')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  rejectSellerProfile(@Param('profileId') profileId: string, @Body() rejectDto: RejectSellerProfileDto) {
    return this.sellerService.rejectSellerProfile(profileId, rejectDto.reason);
  }
}