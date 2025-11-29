import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('sellers/admin')
export class AdminSellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Roles(UserRole.ADMIN)
  @Get('pending')
  async findPendingSellers() {
    return this.sellersService.findAllPendingSellers();
  }

  @Roles(UserRole.ADMIN)
  @Post('approve/:id')
  async approveSeller(@Param('id') id: string) {
    return this.sellersService.approveSeller(id);
  }

  @Roles(UserRole.ADMIN)
  @Post('reject/:id')
  async rejectSeller(@Param('id') id: string) {
    return this.sellersService.rejectSeller(id);
  }
}
