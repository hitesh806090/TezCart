import { UsersService } from './users.service';
import { UpdateProfileDto, ChangePasswordDto, UpdatePreferencesDto } from './dto/profile.dto';
export declare class ProfileController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<Partial<import("../entities/user.entity").User>>;
    updateProfile(updateProfileDto: UpdateProfileDto, req: any): Promise<import("../entities/user.entity").User>;
    changePassword(changePasswordDto: ChangePasswordDto, req: any): Promise<{
        message: string;
    }>;
    updatePreferences(preferencesDto: UpdatePreferencesDto, req: any): Promise<import("../entities/user.entity").User>;
    deleteAccount(req: any): Promise<{
        message: string;
    }>;
}
