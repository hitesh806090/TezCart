import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto/product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new product (Seller/Admin only)' })
    @ApiResponse({ status: 201, description: 'Product created successfully' })
    create(@Body() createProductDto: CreateProductDto, @Request() req: any) {
        return this.productsService.create(createProductDto, req.user.userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get all products with filters and pagination' })
    @ApiResponse({ status: 200, description: 'Returns paginated products' })
    findAll(@Query() query: ProductQueryDto) {
        return this.productsService.findAll(query);
    }

    @Get('featured')
    @ApiOperation({ summary: 'Get featured products' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Returns featured products' })
    getFeatured(@Query('limit') limit?: string) {
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.productsService.getFeaturedProducts(limitNum);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a product by ID' })
    @ApiResponse({ status: 200, description: 'Returns the product' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Get(':id/related')
    @ApiOperation({ summary: 'Get related products' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Returns related products' })
    getRelated(@Param('id') id: string, @Query('limit') limit?: string) {
        const limitNum = limit ? parseInt(limit, 10) : 5;
        return this.productsService.getRelatedProducts(id, limitNum);
    }

    @Get('slug/:slug')
    @ApiOperation({ summary: 'Get a product by slug' })
    @ApiResponse({ status: 200, description: 'Returns the product' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    findBySlug(@Param('slug') slug: string) {
        return this.productsService.findBySlug(slug);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a product (Seller/Admin only)' })
    @ApiResponse({ status: 200, description: 'Product updated successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden - not the product owner' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
        @Request() req: any,
    ) {
        return this.productsService.update(id, updateProductDto, req.user.userId, req.user.role);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a product (Seller/Admin only)' })
    @ApiResponse({ status: 200, description: 'Product deleted successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden - not the product owner' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    remove(@Param('id') id: string, @Request() req: any) {
        return this.productsService.remove(id, req.user.userId, req.user.role);
    }

    @Patch(':id/stock')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update product stock (Seller/Admin only)' })
    @ApiResponse({ status: 200, description: 'Stock updated successfully' })
    updateStock(@Param('id') id: string, @Body('quantity') quantity: number) {
        return this.productsService.updateStock(id, quantity);
    }
}
