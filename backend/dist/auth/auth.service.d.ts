import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { User } from '../entities/user.entity';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        user: User;
        access_token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: User;
        access_token: string;
    }>;
    validateUser(email: string, password: string): Promise<User | null>;
}
