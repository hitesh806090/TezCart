import { Controller, Get, Post, Param, Body, HttpCode, HttpStatus, UseGuards, Request, Put } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { User } from 'db';

class UpdateStockDto {
  quantityChange: number; // Positive for adding, negative for deducting
}

@ApiTags('Inventory')
@Controller('inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get(':productId/stock')
  @Roles('seller', 'admin', 'super_admin') // Sellers and Admins can view stock
  getStock(@Param('productId') productId: string) {
    return this.inventoryService.getStock(productId);
  }

  @Put(':productId/stock')
  @Roles('seller', 'admin', 'super_admin') // Sellers and Admins can update stock
  @HttpCode(HttpStatus.OK)
  updateStock(
    @Param('productId') productId: string,
    @Body() updateStockDto: UpdateStockDto,
    @Request() req: { user: User },
  ) {
    // Authorization check inside service to ensure seller owns product
    return this.inventoryService.updateStock(productId, updateStockDto.quantityChange, req.user.id);
  }

  // Reservation and release would typically be handled internally by other services (e.g., Cart, Order)
  // not directly exposed as public API endpoints for manual interaction.
  // However, for testing or advanced admin tools, dedicated endpoints could be created.
}