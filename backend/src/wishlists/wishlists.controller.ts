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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { WishlistsService } from './wishlists.service';
import { AddToWishlistDto, UpdateWishlistDto } from './dto/wishlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('wishlists')
@Controller('wishlists')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WishlistsController {
    constructor(private readonly wishlistsService: WishlistsService) { }

    @Post('products/:productId')
    @ApiOperation({ summary: 'Add product to wishlist' })
    @ApiParam({ name: 'productId', description: 'Product ID' })
    @ApiResponse({ status: 201, description: 'Product added to wishlist' })
    @ApiResponse({ status: 409, description: 'Product already in wishlist' })
    addToWishlist(
        @Param('productId') productId: string,
        @Body() addToWishlistDto: AddToWishlistDto,
        @Request() req: any,
    ) {
        return this.wishlistsService.addToWishlist(productId, addToWishlistDto, req.user.userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get my wishlist' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Returns user wishlist' })
    getMyWishlist(@Request() req: any, @Query('page') page?: string, @Query('limit') limit?: string) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 20;
        return this.wishlistsService.getMyWishlist(req.user.userId, pageNum, limitNum);
    }

    @Get('count')
    @ApiOperation({ summary: 'Get wishlist items count' })
    @ApiResponse({ status: 200, description: 'Returns wishlist count' })
    getWishlistCount(@Request() req: any) {
        return this.wishlistsService.getWishlistCount(req.user.userId);
    }

    @Get('price-alerts')
    @ApiOperation({ summary: 'Get wishlist items with price drops' })
    @ApiResponse({ status: 200, description: 'Returns items where price dropped to desired level' })
    getWishlistWithPriceAlerts(@Request() req: any) {
        return this.wishlistsService.getWishlistWithPriceAlerts(req.user.userId);
    }

    @Get('back-in-stock')
    @ApiOperation({ summary: 'Get wishlist items that are back in stock' })
    @ApiResponse({ status: 200, description: 'Returns items that are now available' })
    getWishlistBackInStock(@Request() req: any) {
        return this.wishlistsService.getWishlistBackInStock(req.user.userId);
    }

    @Get('products/:productId/check')
    @ApiOperation({ summary: 'Check if product is in wishlist' })
    @ApiParam({ name: 'productId', description: 'Product ID' })
    @ApiResponse({ status: 200, description: 'Returns boolean' })
    async checkInWishlist(@Param('productId') productId: string, @Request() req: any) {
        const isInWishlist = await this.wishlistsService.isInWishlist(productId, req.user.userId);
        return { isInWishlist };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a wishlist item by ID' })
    @ApiResponse({ status: 200, description: 'Returns the wishlist item' })
    @ApiResponse({ status: 404, description: 'Wishlist item not found' })
    findOne(@Param('id') id: string, @Request() req: any) {
        return this.wishlistsService.findOne(id, req.user.userId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update wishlist item settings' })
    @ApiResponse({ status: 200, description: 'Wishlist item updated successfully' })
    update(@Param('id') id: string, @Body() updateWishlistDto: UpdateWishlistDto, @Request() req: any) {
        return this.wishlistsService.update(id, updateWishlistDto, req.user.userId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove item from wishlist' })
    @ApiResponse({ status: 200, description: 'Item removed from wishlist' })
    remove(@Param('id') id: string, @Request() req: any) {
        return this.wishlistsService.remove(id, req.user.userId);
    }

    @Delete('products/:productId')
    @ApiOperation({ summary: 'Remove product from wishlist by product ID' })
    @ApiParam({ name: 'productId', description: 'Product ID' })
    @ApiResponse({ status: 200, description: 'Product removed from wishlist' })
    removeByProduct(@Param('productId') productId: string, @Request() req: any) {
        return this.wishlistsService.removeByProduct(productId, req.user.userId);
    }
}
