import { Controller, Post, Body } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { AuthService } from '../auth/auth.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UserRole } from '../users/entities/user.entity';

@Controller('sellers')
export class SellersController {
  constructor(
    private readonly sellersService: SellersService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() createSellerDto: CreateSellerDto) {
    // Register user with SELLER role
    createSellerDto.role = UserRole.SELLER;
    const user = await this.authService.register(createSellerDto);
    
    // Create seller profile
    const seller = await this.sellersService.create(createSellerDto, user);
    
    return {
      message: 'Seller registered successfully',
      seller,
    };
  }
}
