import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AutomaticDiscountService } from './automatic-discount.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '..//auth/guards/jwt-auth.guard';
import { RolesGuard } from '..//common/guards/roles.guard';
import { Roles } from '..//common/decorators/roles.decorator';

class CreateAutomaticDiscountDto {
  name: string;
  description?: string;
  type: string;
  value?: number;
  validFrom: Date;
  validUntil: Date;
  conditions?: object;
  discountDetails?: object;
  isActive?: boolean;
  usageLimit?: number;
}

class UpdateAutomaticDiscountDto {
  name?: string;
  description?: string;
  type?: string;
  value?: number;
  validFrom?: Date;
  validUntil?: Date;
  conditions?: object;
  discountDetails?: object;
  isActive?: boolean;
  usageLimit?: number;
}

@ApiTags('Automatic Discounts')
@Controller('automatic-discounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super_admin') // Only admins can manage automatic discounts
export class AutomaticDiscountController {
  constructor(private readonly automaticDiscountService: AutomaticDiscountService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateAutomaticDiscountDto) {
    return this.automaticDiscountService.createAutomaticDiscount(createDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAllActive() {
    return this.automaticDiscountService.findAllActiveDiscounts();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id') id: string) {
    return this.automaticDiscountService.findDiscountById(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateDto: UpdateAutomaticDiscountDto) {
    return this.automaticDiscountService.updateAutomaticDiscount(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.automaticDiscountService.deleteAutomaticDiscount(id);
  }
}
