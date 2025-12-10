import { UserRole } from '../../entities/user.entity';
export declare class RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: UserRole;
}
export declare class LoginDto {
    email: string;
    password: string;
}
