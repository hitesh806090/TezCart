import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateProfileDto, ChangePasswordDto, UpdatePreferencesDto } from './dto/profile.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(userData: Partial<User>): Promise<User>;
    findOneById(id: string): Promise<User | null>;
    findOneByEmail(email: string): Promise<User | null>;
    validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
    update(id: string, updateData: Partial<User>): Promise<User>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void>;
    updatePreferences(userId: string, preferencesDto: UpdatePreferencesDto): Promise<User>;
    getProfile(userId: string): Promise<Partial<User>>;
    deleteAccount(userId: string): Promise<void>;
}
