import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new category (Admin only)' })
    @ApiResponse({ status: 201, description: 'Category created successfully' })
    @ApiResponse({ status: 409, description: 'Category with this name already exists' })
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all categories' })
    @ApiResponse({ status: 200, description: 'Returns all categories' })
    findAll(@Query('includeInactive') includeInactive?: string) {
        const includeInactiveBoolean = includeInactive === 'true';
        return this.categoriesService.findAll(includeInactiveBoolean);
    }

    @Get('root')
    @ApiOperation({ summary: 'Get all root categories (no parent)' })
    @ApiResponse({ status: 200, description: 'Returns all root categories' })
    findRootCategories() {
        return this.categoriesService.findRootCategories();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a category by ID' })
    @ApiResponse({ status: 200, description: 'Returns the category' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    findOne(@Param('id') id: string) {
        return this.categoriesService.findOne(id);
    }

    @Get(':id/children')
    @ApiOperation({ summary: 'Get all children of a category' })
    @ApiResponse({ status: 200, description: 'Returns child categories' })
    findChildren(@Param('id') id: string) {
        return this.categoriesService.findChildren(id);
    }

    @Get('slug/:slug')
    @ApiOperation({ summary: 'Get a category by slug' })
    @ApiResponse({ status: 200, description: 'Returns the category' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    findBySlug(@Param('slug') slug: string) {
        return this.categoriesService.findBySlug(slug);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a category (Admin only)' })
    @ApiResponse({ status: 200, description: 'Category updated successfully' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoriesService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a category (Admin only)' })
    @ApiResponse({ status: 200, description: 'Category deleted successfully' })
    @ApiResponse({ status: 400, description: 'Cannot delete category with subcategories' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    remove(@Param('id') id: string) {
        return this.categoriesService.remove(id);
    }
}
