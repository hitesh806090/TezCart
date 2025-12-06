import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { HomePageService } from './homepage.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

class CreateHomePageContentDto {
  sectionType: string;
  title?: string;
  content?: object;
  sectionOrder?: number;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
}

class UpdateHomePageContentDto {
  sectionType?: string;
  title?: string;
  content?: object;
  sectionOrder?: number;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
}

@ApiTags('Homepage')
@Controller('homepage')
export class HomePageController {
  constructor(private readonly homepageService: HomePageService) {}

  @Get()
  // Public endpoint to get rendered homepage content
  getHomepage() {
    return this.homepageService.getHomepageContent();
  }

  // Admin-only endpoints for managing homepage sections
  @Post('admin/sections')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  createSection(@Body() createDto: CreateHomePageContentDto) {
    return this.homepageService.createSection(createDto);
  }

  @Put('admin/sections/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  updateSection(@Param('id') id: string, @Body() updateDto: UpdateHomePageContentDto) {
    return this.homepageService.updateSection(id, updateDto);
  }

  @Delete('admin/sections/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteSection(@Param('id') id: string) {
    return this.homepageService.deleteSection(id);
  }
}