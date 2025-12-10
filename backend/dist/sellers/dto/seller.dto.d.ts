declare class BankDetailsDto {
    accountHolder: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    branch: string;
}
export declare class CreateSellerDto {
    shopName: string;
    description?: string;
    businessName: string;
    businessAddress: string;
    businessPhone: string;
    businessEmail: string;
    taxId?: string;
    gstNumber?: string;
    bankDetails?: BankDetailsDto;
}
export declare class UpdateSellerDto {
    shopName?: string;
    description?: string;
    logo?: string;
    banner?: string;
    businessAddress?: string;
    businessPhone?: string;
    bankDetails?: BankDetailsDto;
}
export declare class ApproveSellerDto {
    commissionRate?: number;
}
export declare class RejectSellerDto {
    reason: string;
}
export {};
