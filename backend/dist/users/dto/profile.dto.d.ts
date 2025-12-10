export declare class UpdateProfileDto {
    name?: string;
    email?: string;
    phone?: string;
    avatar?: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class UpdatePreferencesDto {
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    pushNotifications?: boolean;
    language?: string;
    currency?: string;
}
