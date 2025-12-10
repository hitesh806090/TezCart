import { NotificationType } from '../../entities/notification.entity';
export declare class NotificationQueryDto {
    page?: number;
    limit?: number;
    type?: NotificationType;
    unreadOnly?: boolean;
}
