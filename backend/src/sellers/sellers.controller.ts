import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    UseGuards,
    Request,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SellersService } from './sellers.service';
import { CreateSellerDto, UpdateSellerDto, ApproveSellerDto, RejectSellerDto } from './dto/seller.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SellerStatus } from '../entities/seller.entity';

@ApiTags('sellers')
@Controller('sellers')
export class SellersController {
    constructor(private readonly sellersService: SellersService) { }

    @Post('register')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Register as a seller' })
    @ApiResponse({ status: 201, description: 'Seller account created (pending approval)' })
    @ApiResponse({ status: 409, description: 'User already has a seller account' })
    create(@Body() createSellerDto: CreateSellerDto, @Request() req: any) {
        return this.sellersService.create(createSellerDto, req.user.userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get all sellers (Admin only)' })
    @ApiQuery({ name: 'status', enum: SellerStatus, required: false })
    @ApiResponse({ status: 200, description: 'Returns all sellers' })
    findAll(@Query('status') status?: SellerStatus) {
        return this.sellersService.findAll(status);
    }

    @Get('my-shop')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get my seller shop' })
    @ApiResponse({ status: 200, description: 'Returns seller shop details' })
    @ApiResponse({ status: 404, description: 'No seller account found' })
    getMyShop(@Request() req: any) {
        return this.sellersService.getMyShop(req.user.userId);
    }

    @Get('slug/:slug')
    @ApiOperation({ summary: 'Get seller by shop slug' })
    @ApiParam({ name: 'slug', description: 'Shop slug' })
    @ApiResponse({ status: 200, description: 'Returns seller details' })
    findBySlug(@Param('slug') slug: string) {
        return this.sellersService.findBySlug(slug);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get seller by ID' })
    @ApiParam({ name: 'id', description: 'Seller ID' })
    @ApiResponse({ status: 200, description: 'Returns seller details' })
    findOne(@Param('id') id: string) {
        return this.sellersService.findOne(id);
    }

    @Get(':id/stats')
    @ApiOperation({ summary: 'Get seller statistics' })
    @ApiParam({ name: 'id', description: 'Seller ID' })
    @ApiResponse({ status: 200, description: 'Returns seller stats' })
    getStats(@Param('id') id: string) {
        return this.sellersService.getStats(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update seller shop' })
    @ApiParam({ name: 'id', description: 'Seller ID' })
    @ApiResponse({ status: 200, description: 'Seller updated successfully' })
    update(
        @Param('id') id: string,
        @Body() updateSellerDto: UpdateSellerDto,
        @Request() req: any,
    ) {
        return this.sellersService.update(id, updateSellerDto, req.user.userId);
    }

    @Post(':id/approve')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Approve seller (Admin only)' })
    @ApiParam({ name: 'id', description: 'Seller ID' })
    @ApiResponse({ status: 200, description: 'Seller approved' })
    approve(@Param('id') id: string, @Body() approveDto: ApproveSellerDto) {
        return this.sellersService.approve(id, approveDto);
    }

    @Post(':id/reject')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Reject seller (Admin only)' })
    @ApiParam({ name: 'id', description: 'Seller ID' })
    @ApiResponse({ status: 200, description: 'Seller rejected' })
    reject(@Param('id') id: string, @Body() rejectDto: RejectSellerDto) {
        return this.sellersService.reject(id, rejectDto);
    }

    @Post(':id/suspend')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Suspend seller (Admin only)' })
    @ApiParam({ name: 'id', description: 'Seller ID' })
    @ApiResponse({ status: 200, description: 'Seller suspended' })
    async suspend(@Param('id') id: string, @Body('reason') reason: string) {
        return this.sellersService.suspend(id, reason);
    }

    @Post(':id/activate')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Activate seller (Admin only)' })
    @ApiParam({ name: 'id', description: 'Seller ID' })
    @ApiResponse({ status: 200, description: 'Seller activated' })
    activate(@Param('id') id: string) {
        return this.sellersService.activate(id);
    }
}
