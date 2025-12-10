import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../entities/address.entity';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';

@Injectable()
export class AddressesService {
    constructor(
        @InjectRepository(Address)
        private addressesRepository: Repository<Address>,
    ) { }

    async create(createAddressDto: CreateAddressDto, userId: string): Promise<Address> {
        // If this is set as default, unset other defaults
        if (createAddressDto.isDefault) {
            await this.addressesRepository.update(
                { userId, isDefault: true },
                { isDefault: false },
            );
        }

        const address = this.addressesRepository.create({
            ...createAddressDto,
            userId,
        });

        return this.addressesRepository.save(address);
    }

    async findAll(userId: string): Promise<Address[]> {
        return this.addressesRepository.find({
            where: { userId },
            order: { isDefault: 'DESC', createdAt: 'DESC' },
        });
    }

    async findOne(id: string, userId: string): Promise<Address> {
        const address = await this.addressesRepository.findOne({
            where: { id, userId },
        });

        if (!address) {
            throw new NotFoundException('Address not found');
        }

        return address;
    }

    async getDefault(userId: string): Promise<Address | null> {
        return this.addressesRepository.findOne({
            where: { userId, isDefault: true },
        });
    }

    async update(
        id: string,
        updateAddressDto: UpdateAddressDto,
        userId: string,
    ): Promise<Address> {
        const address = await this.findOne(id, userId);

        // If setting as default, unset other defaults
        if (updateAddressDto.isDefault) {
            await this.addressesRepository.update(
                { userId, isDefault: true },
                { isDefault: false },
            );
        }

        Object.assign(address, updateAddressDto);

        return this.addressesRepository.save(address);
    }

    async setAsDefault(id: string, userId: string): Promise<Address> {
        const address = await this.findOne(id, userId);

        // Unset all other defaults
        await this.addressesRepository.update(
            { userId, isDefault: true },
            { isDefault: false },
        );

        address.isDefault = true;

        return this.addressesRepository.save(address);
    }

    async remove(id: string, userId: string): Promise<void> {
        const address = await this.findOne(id, userId);
        await this.addressesRepository.remove(address);
    }
}
