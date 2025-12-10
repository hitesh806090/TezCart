import {
    Controller,
    Get,
    Patch,
    Delete,
    Body,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto, ChangePasswordDto, UpdatePreferencesDto } from './dto/profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('profile')
@Controller('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfileController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @ApiOperation({ summary: 'Get my profile' })
    @ApiResponse({ status: 200, description: 'Returns user profile' })
    getProfile(@Request() req: any) {
        return this.usersService.getProfile(req.user.userId);
    }

    @Patch()
    @ApiOperation({ summary: 'Update my profile' })
    @ApiResponse({ status: 200, description: 'Profile updated successfully' })
    @ApiResponse({ status: 409, description: 'Email already in use' })
    updateProfile(@Body() updateProfileDto: UpdateProfileDto, @Request() req: any) {
        return this.usersService.updateProfile(req.user.userId, updateProfileDto);
    }

    @Patch('password')
    @ApiOperation({ summary: 'Change password' })
    @ApiResponse({ status: 200, description: 'Password changed successfully' })
    @ApiResponse({ status: 400, description: 'Current password is incorrect' })
    async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Request() req: any) {
        await this.usersService.changePassword(req.user.userId, changePasswordDto);
        return { message: 'Password changed successfully' };
    }

    @Patch('preferences')
    @ApiOperation({ summary: 'Update notification preferences' })
    @ApiResponse({ status: 200, description: 'Preferences updated successfully' })
    updatePreferences(@Body() preferencesDto: UpdatePreferencesDto, @Request() req: any) {
        return this.usersService.updatePreferences(req.user.userId, preferencesDto);
    }

    @Delete()
    @ApiOperation({ summary: 'Delete my account' })
    @ApiResponse({ status: 200, description: 'Account deleted successfully' })
    async deleteAccount(@Request() req: any) {
        await this.usersService.deleteAccount(req.user.userId);
        return { message: 'Account deleted successfully' };
    }
}
