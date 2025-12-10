import { AddressType } from '../../entities/address.entity';
export declare class CreateAddressDto {
    type: AddressType;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
    instructions?: string;
}
export declare class UpdateAddressDto {
    type?: AddressType;
    fullName?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    isDefault?: boolean;
    instructions?: string;
}
