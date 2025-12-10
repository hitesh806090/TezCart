export declare enum UserRole {
    CUSTOMER = "customer",
    SELLER = "seller",
    DELIVERY_PARTNER = "delivery_partner",
    ADMIN = "admin"
}
export declare class User {
    id: string;
    email: string;
    phone: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
