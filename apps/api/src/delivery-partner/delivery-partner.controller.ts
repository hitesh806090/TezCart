import { Controller, Get, Post, Put, Param, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { DeliveryPartnerService } from './delivery-partner.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { User } from 'db';

class RegisterDeliveryPartnerDto {
  name: string;
  phoneNumber: string;
  vehicleType: string;
  vehicleNumber: string;
  serviceZones?: object;
}

class UpdateDeliveryPartnerProfileDto {
  name?: string;
  phoneNumber?: string;
  vehicleType?: string;
  vehicleNumber?: string;
  serviceZones?: object;
}

class UploadKycDocumentDto {
  documentType: string; // e.g., 'driver_license', 'vehicle_registration'
  documentUrl: string; // S3 or similar storage URL
}

class UpdatePartnerStatusDto {
  status: 'online' | 'offline' | 'on_delivery' | 'break';
}

class UpdatePartnerLocationDto {
  latitude: number;
  longitude: number;
}

class ReviewKycDocumentDto {
  status: 'approved' | 'rejected';
  rejectionReason?: string;
}

@ApiTags('Delivery Partner')
@Controller('delivery-partner')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // All delivery partner operations require authentication
export class DeliveryPartnerController {
  constructor(private readonly deliveryPartnerService: DeliveryPartnerService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  registerDeliveryPartner(@Body() registerDpDto: RegisterDeliveryPartnerDto, @Request() req: { user: User }) {
    return this.deliveryPartnerService.registerDeliveryPartner(req.user.id, registerDpDto);
  }

  @Get('profile')
  @UseGuards(RolesGuard)
  @Roles('delivery_partner', 'admin', 'super_admin')
  getDeliveryPartnerProfile(@Request() req: { user: User }) {
    return this.deliveryPartnerService.getDeliveryPartnerProfile(req.user.id);
  }

  @Put('profile')
  @UseGuards(RolesGuard)
  @Roles('delivery_partner')
  updateDeliveryPartnerProfile(@Body() updateDpDto: UpdateDeliveryPartnerProfileDto, @Request() req: { user: User }) {
    return this.deliveryPartnerService.updateDeliveryPartnerProfile(req.user.id, updateDpDto);
  }

  @Put('status')
  @UseGuards(RolesGuard)
  @Roles('delivery_partner')
  updateStatus(@Body() updateStatusDto: UpdatePartnerStatusDto, @Request() req: { user: User }) {
    return this.deliveryPartnerService.updatePartnerStatus(req.user.id, updateStatusDto.status);
  }

  @Put('location')
  @UseGuards(RolesGuard)
  @Roles('delivery_partner')
  updateLocation(@Body() updateLocationDto: UpdatePartnerLocationDto, @Request() req: { user: User }) {
    return this.deliveryPartnerService.updatePartnerLocation(req.user.id, updateLocationDto.latitude, updateLocationDto.longitude);
  }

  @Post('kyc/upload')
  @UseGuards(RolesGuard)
  @Roles('delivery_partner')
  uploadKycDocument(@Body() uploadKycDto: UploadKycDocumentDto, @Request() req: { user: User }) {
    return this.deliveryPartnerService.uploadKycDocument(req.user.id, uploadKycDto.documentType, uploadKycDto.documentUrl);
  }

  @Get('kyc/documents')
  @UseGuards(RolesGuard)
  @Roles('delivery_partner')
  getKycDocuments(@Request() req: { user: User }) {
    return this.deliveryPartnerService.getKycDocuments(req.user.id);
  }

  // --- Admin Endpoints for Delivery Partner Management ---
  @Get('admin/pending-approvals')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  getPendingDeliveryPartnerApprovals() {
    return this.deliveryPartnerService.getPendingDeliveryPartnerApprovals();
  }

  @Put('admin/kyc/:documentId/review')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  reviewKycDocument(@Param('documentId') documentId: string, @Body() reviewDto: ReviewKycDocumentDto) {
    return this.deliveryPartnerService.reviewKycDocument(documentId, reviewDto.status, reviewDto.rejectionReason);
  }

  @Put('admin/profile/:profileId/approve')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  approveDeliveryPartner(@Param('profileId') profileId: string) {
    return this.deliveryPartnerService.approveDeliveryPartner(profileId);
  }
}
