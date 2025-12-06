import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

class CreateCategoryDto {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string; // Optional, for hierarchical categories
  isActive?: boolean;
  seo?: object;
}

class UpdateCategoryDto {
  name?: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  isActive?: boolean;
  seo?: object;
}

@ApiTags('Categories')
@Controller('categories')
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin') // Only admins can create categories
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get()
  // Accessible by all, but can add roles for specific use cases (e.g., hidden categories)
  findAll() {
    return this.categoryService.findAllCategories();
  }

  @Get('tree')
  // Accessible by all, returns the full category tree
  findTree() {
    return this.categoryService.findCategoryTree();
  }

  @Get(':id')
  // Accessible by all
  findOne(@Param('id') id: string) {
    return this.categoryService.findCategoryById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin') // Only admins can update categories
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin') // Only admins can delete categories
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}