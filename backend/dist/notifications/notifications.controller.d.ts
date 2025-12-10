import { NotificationsService } from './notifications.service';
import { NotificationQueryDto } from './dto/notification.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(req: any, query: NotificationQueryDto): Promise<{
        data: import("../entities/notification.entity").Notification[];
        total: number;
        unreadCount: number;
    }>;
    getUnreadCount(req: any): Promise<{
        count: number;
    }>;
    markAsRead(id: string, req: any): Promise<import("../entities/notification.entity").Notification | null>;
    markAllAsRead(req: any): Promise<{
        message: string;
    }>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
    removeAll(req: any): Promise<{
        message: string;
    }>;
}
