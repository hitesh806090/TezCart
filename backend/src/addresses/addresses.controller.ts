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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('addresses')
@Controller('addresses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AddressesController {
    constructor(private readonly addressesService: AddressesService) { }

    @Post()
    @ApiOperation({ summary: 'Add new address' })
    @ApiResponse({ status: 201, description: 'Address created successfully' })
    create(@Body() createAddressDto: CreateAddressDto, @Request() req: any) {
        return this.addressesService.create(createAddressDto, req.user.userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get all my addresses' })
    @ApiResponse({ status: 200, description: 'Returns all addresses' })
    findAll(@Request() req: any) {
        return this.addressesService.findAll(req.user.userId);
    }

    @Get('default')
    @ApiOperation({ summary: 'Get default address' })
    @ApiResponse({ status: 200, description: 'Returns default address' })
    getDefault(@Request() req: any) {
        return this.addressesService.getDefault(req.user.userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get address by ID' })
    @ApiResponse({ status: 200, description: 'Returns the address' })
    @ApiResponse({ status: 404, description: 'Address not found' })
    findOne(@Param('id') id: string, @Request() req: any) {
        return this.addressesService.findOne(id, req.user.userId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update address' })
    @ApiResponse({ status: 200, description: 'Address updated successfully' })
    update(
        @Param('id') id: string,
        @Body() updateAddressDto: UpdateAddressDto,
        @Request() req: any,
    ) {
        return this.addressesService.update(id, updateAddressDto, req.user.userId);
    }

    @Post(':id/set-default')
    @ApiOperation({ summary: 'Set address as default' })
    @ApiResponse({ status: 200, description: 'Address set as default' })
    setAsDefault(@Param('id') id: string, @Request() req: any) {
        return this.addressesService.setAsDefault(id, req.user.userId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete address' })
    @ApiResponse({ status: 200, description: 'Address deleted successfully' })
    remove(@Param('id') id: string, @Request() req: any) {
        return this.addressesService.remove(id, req.user.userId);
    }
}
