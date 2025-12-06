import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, UseGuards, Request, Query, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiTags, ApiQuery, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { User } from 'db';
import { SearchService } from '../search/search.service';
import { Readable } from 'stream';

class CreateProductDto {
  title: string;
  slug: string;
  description?: string;
  price: number;
  salePrice?: number;
  imageUrl?: string;
  images?: string[];
  stock: number;
  categoryId?: string;
  attributes?: object;
  seo?: object;
}

class UpdateProductDto {
  title?: string;
  slug?: string;
  description?: string;
  price?: number;
  salePrice?: number;
  imageUrl?: string;
  images?: string[];
  stock?: number;
  categoryId?: string;
  attributes?: object;
  seo?: object;
  status?: string; // For admin to update status
}

class SubscribeToProductAlertDto {
  alertType: 'price_drop' | 'back_in_stock';
  thresholdPrice?: number; // Required for price_drop
}

@ApiTags('Products')
@Controller('products')
@ApiBearerAuth()
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly searchService: SearchService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller', 'admin', 'super_admin')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto, @Request() req: { user: User }) {
    return this.productService.createProduct(createProductDto, req.user.id);
  }

  @Post('bulk-upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller', 'admin', 'super_admin')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'CSV file containing product data',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async bulkUploadProducts(@UploadedFile() file: Express.Multer.File, @Request() req: { user: User }) {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file uploaded or file is empty.');
    }
    if (file.mimetype !== 'text/csv') {
      throw new BadRequestException('Only CSV files are allowed.');
    }

    const readableStream = Readable.from(file.buffer.toString());
    return this.productService.bulkCreateProducts(readableStream, req.user.id);
  }

  @Get()
  @ApiQuery({ name: 'sellerId', required: false, type: String, description: 'Filter products by seller ID' })
  @ApiQuery({ name: 'q', required: false, type: String, description: 'Search query' })
  @ApiQuery({ name: 'categoryId', required: false, type: String, description: 'Filter by Category ID' })
  @ApiQuery({ name: 'minPrice', required: false, type: Number, description: 'Minimum price' })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number, description: 'Maximum price' })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'Sort by field (e.g., price:asc, createdAt:desc)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page', example: 10 })
  async findPublicProducts(
    @Query('q') query?: string,
    @Query('categoryId') categoryId?: string,
    @Query('sellerId') sellerId?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('sort') sort?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const filters: string[] = [`status = "published"`];

    if (categoryId) filters.push(`categoryId = "${categoryId}"`);
    if (sellerId) filters.push(`sellerId = "${sellerId}"`);
    if (minPrice) filters.push(`price >= ${minPrice}`);
    if (maxPrice) filters.push(`price <= ${maxPrice}`);

    const sortOptions: string[] = [];
    if (sort) {
        const [field, order] = sort.split(':');
        if (field && order) sortOptions.push(`${field}:${order}`);
    } else {
        sortOptions.push(`createdAt:desc`);
    }

    const searchOptions = {
      filter: filters,
      sort: sortOptions,
      offset: (page - 1) * limit,
      limit: limit,
    };

    const searchResult = await this.searchService.searchProducts(query || '', searchOptions);

    return {
      data: searchResult.hits,
      total: searchResult.estimatedTotalHits,
      page,
      limit,
      totalPages: Math.ceil(searchResult.estimatedTotalHits / limit),
    };
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findProductById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller', 'admin', 'super_admin')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Request() req: { user: User }) {
    return this.productService.updateProduct(id, updateProductDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller', 'admin', 'super_admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Request() req: { user: User }) {
    return this.productService.deleteProduct(id, req.user.id);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  updateStatus(@Param('id') id: string, @Body('status') status: string, @Request() req: { user: User }) {
    return this.productService.updateProductStatus(id, status, req.user.id);
  }

  // --- Product Alert Endpoints ---
  @Post(':productId/alerts/subscribe')
  @UseGuards(JwtAuthGuard) // Customers can subscribe
  @HttpCode(HttpStatus.CREATED)
  async subscribeToAlert(@Param('productId') productId: string, @Body() subscribeDto: SubscribeToProductAlertDto, @Request() req: { user: User }) {
    return this.productService.subscribeToAlert(req.user.id, productId, subscribeDto.alertType, subscribeDto.thresholdPrice);
  }

  @Delete(':productId/alerts/unsubscribe')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async unsubscribeFromAlert(@Param('productId') productId: string, @Body('alertType') alertType: 'price_drop' | 'back_in_stock', @Request() req: { user: User }) {
    return this.productService.unsubscribeFromAlert(req.user.id, productId, alertType);
  }

  @Get('my-alerts')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getMyProductAlerts(@Request() req: { user: User }) {
      return this.productService.getUserProductAlerts(req.user.id);
  }
}
