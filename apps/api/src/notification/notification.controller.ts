import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { User } from 'db';

class CreateTemplateDto {
  type: string;
  channel: string;
  subject?: string;
  template: string;
  metadata?: object;
  isActive?: boolean;
}

class UpdateTemplateDto {
  subject?: string;
  template?: string;
  metadata?: object;
  isActive?: boolean;
}

class SendNotificationDto {
  userId: string;
  type: string;
  channel: 'email' | 'sms' | 'push' | 'in_app';
  data: object; // Data for template rendering
  recipient?: string; // Optional: override recipient from user profile
}

@ApiTags('Notifications')
@Controller('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // All notification operations require authentication
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // --- User Endpoints (In-App Inbox) ---
  @Get('my-inbox')
  @HttpCode(HttpStatus.OK)
  async getMyInboxNotifications(@Request() req: { user: User }) {
    return this.notificationService.getUserNotifications(req.user.id);
  }

  @Put('my-inbox/:id/read')
  @HttpCode(HttpStatus.OK)
  async markNotificationAsRead(@Param('id') id: string, @Request() req: { user: User }) {
    return this.notificationService.markNotificationAsRead(id, req.user.id);
  }

  // --- Admin Endpoints (Template Management) ---
  @Post('admin/templates')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.CREATED)
  createTemplate(@Body() createDto: CreateTemplateDto) {
    return this.notificationService.createTemplate(createDto);
  }

  @Get('admin/templates/:type/:channel')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  getTemplate(@Param('type') type: string, @Param('channel') channel: string) {
    return this.notificationService.getTemplate(type, channel);
  }

  @Put('admin/templates/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  updateTemplate(@Param('id') id: string, @Body() updateDto: UpdateTemplateDto) {
    return this.notificationService.updateTemplate(id, updateDto);
  }

  @Delete('admin/templates/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTemplate(@Param('id') id: string) {
    return this.notificationService.deleteTemplate(id);
  }

  @Post('admin/send-notification')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  sendNotification(@Body() sendDto: SendNotificationDto) {
    return this.notificationService.sendNotification(
      sendDto.userId,
      sendDto.type,
      sendDto.channel,
      sendDto.data,
      sendDto.recipient,
    );
  }
}