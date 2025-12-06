import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '..//auth/guards/jwt-auth.guard';
import { RolesGuard } from '..//common/guards/roles.guard';
import { Roles } from '..//common/decorators/roles.decorator';
import { User } from 'db';
import { CampaignProduct } from 'db';

class CreateCampaignDto {
  name: string;
  slug: string;
  description?: string;
  type: string;
  validFrom: Date;
  validUntil: Date;
  status?: string;
  rules?: object;
  bannerImageUrl?: string;
  metadata?: object;
}

class UpdateCampaignDto {
  name?: string;
  slug?: string;
  description?: string;
  type?: string;
  validFrom?: Date;
  validUntil?: Date;
  status?: string;
  rules?: object;
  bannerImageUrl?: string;
  metadata?: object;
}

class AddProductToCampaignDto {
  productId: string;
  campaignPrice?: number;
  campaignStock?: number;
  maxPurchasePerUser?: number;
  metadata?: object;
}

@ApiTags('Campaigns')
@Controller('campaigns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard) // All campaign operations require authentication and roles
@Roles('admin', 'super_admin') // Only admins can manage campaigns for now
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createCampaign(@Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignService.createCampaign(createCampaignDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAllCampaigns() {
    return this.campaignService.findAllCampaigns();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findCampaignById(@Param('id') id: string) {
    return this.campaignService.findCampaignById(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateCampaign(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
    return this.campaignService.updateCampaign(id, updateCampaignDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteCampaign(@Param('id') id: string) {
    return this.campaignService.deleteCampaign(id);
  }

  @Post(':campaignId/products')
  @HttpCode(HttpStatus.CREATED)
  addProductToCampaign(@Param('campaignId') campaignId: string, @Body() addProductDto: AddProductToCampaignDto) {
    return this.campaignService.addProductToCampaign(campaignId, addProductDto.productId, addProductDto);
  }

  @Get(':campaignId/products')
  @HttpCode(HttpStatus.OK)
  getCampaignProducts(@Param('campaignId') campaignId: string) {
    return this.campaignService.getCampaignProducts(campaignId);
  }

  @Delete('products/:campaignProductId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeProductFromCampaign(@Param('campaignProductId') campaignProductId: string) {
    return this.campaignService.removeProductFromCampaign(campaignProductId);
  }
}