import { Controller, Get, Param, UseGuards, Request, Body, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { User } from 'db';

class UpdateProfileDto {
  phoneNumber?: string;
  profile?: object; // Use object for JSONB column
  defaultPersona?: string; // Allow changing default persona if applicable
  isActive?: boolean; // Allow deactivating user by admin
}

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer', 'seller', 'delivery_partner', 'admin', 'super_admin') // All authenticated users can access their own profile
  @ApiBearerAuth() // For Swagger documentation
  async getMe(@Request() req: { user: User }) {
    // req.user is populated by JwtAuthGuard
    // Ensure we return the full user data from DB, not just the JWT payload
    return this.userService.findUserById(req.user.id);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer', 'seller', 'delivery_partner', 'admin', 'super_admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async updateMe(@Body() updateProfileDto: UpdateProfileDto, @Request() req: { user: User }) {
    return this.userService.updateUser(req.user.id, updateProfileDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin') // Only admins can fetch other user profiles by ID
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }

  // Example of an admin updating any user's profile
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async updateAnyUser(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.userService.updateUser(id, updateProfileDto);
  }
}
