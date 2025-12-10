import { User } from './user.entity';
export declare enum AddressType {
    HOME = "home",
    WORK = "work",
    OTHER = "other"
}
export declare class Address {
    id: string;
    user: User;
    userId: string;
    type: AddressType;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
    instructions: string;
    createdAt: Date;
    updatedAt: Date;
}
