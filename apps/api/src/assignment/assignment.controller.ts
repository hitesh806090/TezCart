import { Controller, Get, Post, Put, Param, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { User } from 'db';

class DeclineTaskDto {
  reason: string;
}

class VerifyOtpDto {
  otp: string;
}

class CompleteDeliveryDto {
  proofPhotoUrls?: string[];
  customerSignatureUrl?: string;
}

class CompleteReturnPickupDto {
  proofPhotoUrls?: string[];
}


@ApiTags('Delivery Assignment')
@Controller('assignment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // All assignment operations require authentication
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  // --- Outbound Delivery Task Endpoints ---
  @Post('admin/create-delivery-task/:orderId')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin') // Only admins can create tasks
  @HttpCode(HttpStatus.CREATED)
  createDeliveryTask(@Param('orderId') orderId: string) {
    return this.assignmentService.createDeliveryTask(orderId);
  }

  @Post('admin/assign-delivery-task/:taskId')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin') // Only admins can trigger auto-assignment
  @HttpCode(HttpStatus.OK)
  autoAssignDeliveryTask(@Param('taskId') taskId: string) {
    return this.assignmentService.autoAssignTask(taskId);
  }

  @Put('delivery-tasks/:taskId/accept')
  @UseGuards(RolesGuard)
  @Roles('delivery_partner') // Only DPs can accept their tasks
  @HttpCode(HttpStatus.OK)
  acceptDeliveryTask(@Param('taskId') taskId: string, @Request() req: { user: User }) {
    return this.assignmentService.acceptTask(taskId, req.user.id);
  }

  @Put('delivery-tasks/:taskId/decline')
  @UseGuards(RolesGuard)
  @Roles('delivery_partner') // Only DPs can decline their tasks
  @HttpCode(HttpStatus.OK)
  declineDeliveryTask(@Param('taskId') taskId: string, @Body() declineDto: DeclineTaskDto, @Request() req: { user: User }) {
    return this.assignmentService.declineTask(taskId, req.user.id, declineDto.reason);
  }

  @Post('delivery-tasks/:taskId/send-otp')
  @UseGuards(RolesGuard)
  @Roles('delivery_partner')
  @HttpCode(HttpStatus.OK)
  sendOtpForDelivery(@Param('taskId') taskId: string) {
    return this.assignmentService.generateAndSendOtp(taskId);
  }

  @Post('delivery-tasks/:taskId/verify-otp')
  @UseGuards(RolesGuard)
  @Roles('delivery_partner')
  @HttpCode(HttpStatus.OK)
  verifyDeliveryOtp(@Param('taskId') taskId: string, @Body() verifyOtpDto: VerifyOtpDto) {
    return this.assignmentService.verifyOtp(taskId, verifyOtpDto.otp);
  }

  @Post('delivery-tasks/:taskId/complete')
  @UseGuards(RolesGuard)
  @Roles('delivery_partner')
  @HttpCode(HttpStatus.OK)
  completeDelivery(
    @Param('taskId') taskId: string,
    @Body() completeDeliveryDto: CompleteDeliveryDto,
    @Request() req: { user: User },
  ) {
    return this.assignmentService.completeDelivery(
      taskId,
      req.user.id,
      completeDeliveryDto.proofPhotoUrls,
      completeDeliveryDto.customerSignatureUrl,
    );
  }

  // --- Inbound Return Pickup Task Endpoints ---
  @Post('admin/create-return-pickup-task/:returnRequestId')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.CREATED)
  createReturnPickupTask(@Param('returnRequestId') returnRequestId: string) {
    return this.assignmentService.createReturnPickupTask(returnRequestId);
  }

  @Post('admin/assign-return-pickup-task/:taskId')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  autoAssignReturnPickupTask(@Param('taskId') taskId: string) {
    return this.assignmentService.autoAssignReturnPickupTask(taskId);
  }

  @Put('return-pickup-tasks/:taskId/accept')
  @UseGuards(RolesGuard)
  @Roles('delivery_partner')
  @HttpCode(HttpStatus.OK)
  acceptReturnPickupTask(@Param('taskId') taskId: string, @Request() req: { user: User }) {
    return this.assignmentService.acceptReturnPickupTask(taskId, req.user.id);
  }

  @Post('return-pickup-tasks/:taskId/complete')
  @UseGuards(RolesGuard)
  @Roles('delivery_partner')
  @HttpCode(HttpStatus.OK)
  completeReturnPickup(@Param('taskId') taskId: string, @Body() completeDto: CompleteReturnPickupDto, @Request() req: { user: User }) {
    return this.assignmentService.completeReturnPickup(taskId, req.user.id, completeDto.proofPhotoUrls);
  }

  // A GET endpoint to list tasks for a delivery partner could also be added here
}