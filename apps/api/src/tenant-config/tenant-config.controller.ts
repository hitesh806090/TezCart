import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { TenantConfigService } from './tenant-config.service';
import { ApiTags } from '@nestjs/swagger';

class CodSettingsDto {
  isEnabled: boolean;
  maxAmount?: number; // Maximum order amount for COD
  minAmount?: number; // Minimum order amount for COD
  restrictedRegions?: string[]; // List of region codes/pincodes where COD is disabled
  feePercentage?: number; // Optional COD fee percentage
  fixedFee?: number; // Optional fixed COD fee
}

class TenantConfigDto {
  codSettings?: CodSettingsDto;
  // Other tenant-specific configurations can be added here
  // e.g., currency, language, branding, etc.
}

class CreateTenantDto {
  name: string;
  code: string;
  domain?: string;
  status?: string;
  config?: TenantConfigDto; // Use the structured TenantConfigDto
}

class UpdateTenantDto {
  name?: string;
  code?: string;
  domain?: string;
  status?: string;
  config?: TenantConfigDto; // Use the structured TenantConfigDto
}

@ApiTags('Tenant Configuration')
@Controller('tenant-config')
export class TenantConfigController {
  constructor(private readonly tenantConfigService: TenantConfigService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantConfigService.createTenant(createTenantDto);
  }

  @Get()
  findAll() {
    return this.tenantConfigService.findAllTenants();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tenantConfigService.findTenantById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
    return this.tenantConfigService.updateTenant(id, updateTenantDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.tenantConfigService.deleteTenant(id);
  }
}
