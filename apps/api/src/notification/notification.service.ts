import { Injectable, NotFoundException, BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationTemplate } from 'db';
import { Notification } from 'db';
import { TenantProvider } from '..//common/tenant.module';
import { UserService } from '../user/user.service'; // To get user details
import { User } from 'db'; // Import User for type hinting

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(NotificationTemplate)
    private readonly templateRepository: Repository<NotificationTemplate>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
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

  // --- Notification Template Management ---
  async createTemplate(templateData: Partial<NotificationTemplate>): Promise<NotificationTemplate> {
    const existing = await this.templateRepository.findOne({
      where: { tenantId: this.tenantId, type: templateData.type, channel: templateData.channel },
    });
    if (existing) {
      throw new ConflictException(`Template for type '${templateData.type}' on channel '${templateData.channel}' already exists.`);
    }
    const template = this.templateRepository.create({ ...templateData, tenantId: this.tenantId });
    return this.templateRepository.save(template);
  }

  async getTemplate(type: string, channel: string): Promise<NotificationTemplate> {
    const template = await this.templateRepository.findOne({
      where: { tenantId: this.tenantId, type, channel, isActive: true },
    });
    if (!template) {
      throw new NotFoundException(`Notification template for type '${type}' on channel '${channel}' not found or inactive.`);
    }
    return template;
  }

  async updateTemplate(id: string, updateData: Partial<NotificationTemplate>): Promise<NotificationTemplate> {
    const template = await this.templateRepository.findOne({ where: { id, tenantId: this.tenantId } });
    if (!template) {
      throw new NotFoundException(`Notification template with ID ${id} not found.`);
    }
    this.templateRepository.merge(template, updateData);
    return this.templateRepository.save(template);
  }

  async deleteTemplate(id: string): Promise<void> {
    const result = await this.templateRepository.delete({ id, tenantId: this.tenantId });
    if (result.affected === 0) {
      throw new NotFoundException(`Notification template with ID ${id} not found.`);
    }
  }

  // --- Sending Notifications ---
  async sendNotification(
    userId: string,
    type: string,
    channel: 'email' | 'sms' | 'push' | 'in_app',
    data: any, // Data to render the template
    recipient?: string, // Override recipient from user profile
  ): Promise<Notification> {
    const user = await this.userService.findUserById(userId); // Also validates tenantId
    const template = await this.getTemplate(type, channel);

    let resolvedRecipient = recipient;
    if (!resolvedRecipient) {
      switch (channel) {
        case 'email': resolvedRecipient = user.email; break;
        case 'sms': resolvedRecipient = user.phoneNumber; break;
        case 'push': /* resolvedRecipient = user.deviceToken; */ resolvedRecipient = 'mock_device_token'; break; // Placeholder
        case 'in_app': resolvedRecipient = user.id; break; // In-app notifications are for the user ID
      }
    }

    if (!resolvedRecipient) {
      this.logger.warn(`No recipient found for user ${userId}, type ${type}, channel ${channel}. Notification not sent.`);
      throw new BadRequestException('No recipient information available.');
    }

    // Render template (simplified: assuming template is just a string for now, no complex templating engine)
    const body = this.renderTemplate(template.template, data);
    const subject = template.subject ? this.renderTemplate(template.subject, data) : null;

    // Simulate sending based on channel
    let status: string = 'sent';
    let failureReason: string | null = null;
    try {
      switch (channel) {
        case 'email': this.logger.log(`Mock Email to ${resolvedRecipient} - Subject: ${subject}, Body: ${body}`); break;
        case 'sms': this.logger.log(`Mock SMS to ${resolvedRecipient} - Body: ${body}`); break;
        case 'push': this.logger.log(`Mock Push to ${resolvedRecipient} - Title: ${subject}, Body: ${body}`); break;
        case 'in_app': this.logger.log(`Mock In-App Notification for ${resolvedRecipient} - Title: ${subject}, Body: ${body}`); break;
      }
      // In a real system, integrate with specific providers here (e.g., SendGrid, Twilio, FCM)
      // and update status based on provider response.
    } catch (error) {
      status = 'failed';
      failureReason = error.message;
      this.logger.error(`Failed to send notification for user ${userId}, type ${type}, channel ${channel}: ${error.message}`);
    }

    const notification = this.notificationRepository.create({
      userId,
      tenantId: this.tenantId,
      type,
      channel,
      recipient: resolvedRecipient,
      subject: subject || 'No Subject',
      body,
      status,
      failureReason,
      sentAt: new Date(),
      metadata: { templateId: template.id, data },
    });

    return this.notificationRepository.save(notification);
  }

  private renderTemplate(templateString: string, data: any): string {
    // Basic placeholder for template rendering.
    // In a real app, use a templating engine like Handlebars, EJS, etc.
    let rendered = templateString;
    for (const key in data) {
      rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
    }
    return rendered;
  }

  // --- In-App Inbox (Customer Notifications) ---
  async getUserNotifications(userId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { userId, tenantId: this.tenantId, channel: 'in_app' },
      order: { sentAt: 'DESC' },
    });
  }

  async markNotificationAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({ where: { id, userId, tenantId: this.tenantId } });
    if (!notification) {
      throw new NotFoundException('Notification not found.');
    }
    notification.status = 'read';
    return this.notificationRepository.save(notification);
  }
}