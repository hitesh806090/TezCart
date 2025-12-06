import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AddressService } from './address.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from 'db';

class CreateAddressDto {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  phoneNumber?: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
}

class UpdateAddressDto {
  name?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  phoneNumber?: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
}

@ApiTags('Addresses')
@Controller('addresses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAddressDto: CreateAddressDto, @Request() req: { user: User }) {
    return this.addressService.createAddress(req.user.id, createAddressDto);
  }

  @Get()
  findAll(@Request() req: { user: User }) {
    return this.addressService.findAllAddresses(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: { user: User }) {
    return this.addressService.findAddressById(req.user.id, id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto, @Request() req: { user: User }) {
    return this.addressService.updateAddress(req.user.id, id, updateAddressDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Request() req: { user: User }) {
    return this.addressService.deleteAddress(req.user.id, id);
  }

  @Post(':id/set-default')
  @HttpCode(HttpStatus.OK)
  setDefault(@Param('id') id: string, @Request() req: { user: User }) {
    return this.addressService.setDefaultAddress(req.user.id, id);
  }
}