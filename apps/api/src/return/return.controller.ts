import { Controller, Get, Post, Put, Param, Body, HttpCode, HttpStatus, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { ReturnService } from './return.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { User } from 'db';

class CreateReturnReasonDto {
  name: string;
  description?: string;
  isActive?: boolean;
  metadata?: object;
}

class InitiateReturnItemDto {
  orderItemId: string;
  quantity: number;
}

class InitiateReturnRequestDto {
  orderId: string;
  requestType: 'refund' | 'replacement';
  returnItems: InitiateReturnItemDto[];
  returnReasonId: string;
  customerComment?: string;
  proofImageUrls?: string[];
}

class ApproveRejectReturnDto {
  comment?: string;
  reason?: string; // For rejection
}

class ProcessRefundDto {
  refundMethod: 'wallet' | 'source'; // 'wallet' or 'source' (original payment method)
}

@ApiTags('Returns')
@Controller('returns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // All return operations require authentication
export class ReturnController {
  constructor(private readonly returnService: ReturnService) {}

  // --- Customer Endpoints ---
  @Post('initiate')
  @HttpCode(HttpStatus.CREATED)
  async initiateReturn(@Body() initiateDto: InitiateReturnRequestDto, @Request() req: { user: User }) {
    return this.returnService.initiateReturnRequest(
      req.user.id,
      initiateDto.orderId,
      initiateDto.requestType,
      initiateDto.returnItems,
      initiateDto.returnReasonId,
      initiateDto.customerComment,
      initiateDto.proofImageUrls,
    );
  }

  @Get('my-requests')
  @HttpCode(HttpStatus.OK)
  async getMyReturnRequests(@Request() req: { user: User }) {
    return this.returnService.getUserReturnRequests(req.user.id);
  }

  @Get('requests/:id')
  @HttpCode(HttpStatus.OK)
  async getReturnRequestById(@Param('id') id: string, @Request() req: { user: User }) {
    const request = await this.returnService.getReturnRequest(id);
    if (request.userId !== req.user.id && req.user.defaultPersona !== 'admin' && req.user.defaultPersona !== 'super_admin') {
      throw new UnauthorizedException('You are not authorized to view this return request.');
    }
    return request;
  }

  // --- Public/Shared Endpoints ---
  @Get('reasons')
  @HttpCode(HttpStatus.OK)
  findAllReturnReasons() {
    return this.returnService.findAllReturnReasons();
  }


  // --- Admin Endpoints for managing Return Reasons ---
  @Post('admin/reasons')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.CREATED)
  createReturnReason(@Body() createDto: CreateReturnReasonDto) {
    return this.returnService.createReturnReason(createDto.name, createDto.description, createDto.isActive, createDto.metadata);
  }

  // --- Seller/Admin Endpoints for reviewing Return Requests ---
  @Get('seller/requests')
  @UseGuards(RolesGuard)
  @Roles('seller', 'admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  async getSellerReturnRequests(@Request() req: { user: User }) {
    const sellerId = (req.user.defaultPersona === 'seller') ? req.user.id : undefined;
    return this.returnService.getSellerReturnRequests(sellerId);
  }

  @Get('admin/requests')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  async getAdminReturnRequests(@Query('status') status?: string) {
    return this.returnService.getAdminReturnRequests(status);
  }

  @Put('requests/:id/approve')
  @UseGuards(RolesGuard)
  @Roles('seller', 'admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  async approveReturnRequest(@Param('id') id: string, @Body() approveDto: ApproveRejectReturnDto, @Request() req: { user: User }) {
    return this.returnService.approveReturnRequest(id, req.user.id, approveDto.comment);
  }

  @Put('requests/:id/reject')
  @UseGuards(RolesGuard)
  @Roles('seller', 'admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  async rejectReturnRequest(@Param('id') id: string, @Body() rejectDto: ApproveRejectReturnDto, @Request() req: { user: User }) {
    if (!rejectDto.reason) {
      throw new BadRequestException('Rejection reason is required.');
    }
    return this.returnService.rejectReturnRequest(id, req.user.id, rejectDto.reason);
  }

  // --- Admin Endpoint for Processing Refunds ---
  @Post('requests/:id/process-refund')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  async processRefund(@Param('id') id: string, @Body() processRefundDto: ProcessRefundDto, @Request() req: { user: User }) {
    return this.returnService.processRefund(id, processRefundDto.refundMethod, req.user.id);
  }
}