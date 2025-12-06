import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from 'db';
import { TenantProvider } from '..//common/tenant.module';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly tenantProvider: TenantProvider,
  ) {}

  private get tenantId(): string {
    const tenantId = this.tenantProvider.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing.');
    }
    return tenantId;
  }

  async createAddress(userId: string, addressData: Partial<Address>): Promise<Address> {
    const newAddress = this.addressRepository.create({
      ...addressData,
      userId,
      tenantId: this.tenantId,
    });
    return this.addressRepository.save(newAddress);
  }

  async findAllAddresses(userId: string): Promise<Address[]> {
    return this.addressRepository.find({ where: { userId, tenantId: this.tenantId } });
  }

  async findAddressById(userId: string, addressId: string): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id: addressId, userId, tenantId: this.tenantId },
    });
    if (!address) {
      throw new NotFoundException(`Address with ID ${addressId} not found.`);
    }
    return address;
  }

  async updateAddress(userId: string, addressId: string, addressData: Partial<Address>): Promise<Address> {
    const address = await this.findAddressById(userId, addressId); // Ensures address belongs to user and tenant
    this.addressRepository.merge(address, addressData);
    return this.addressRepository.save(address);
  }

  async deleteAddress(userId: string, addressId: string): Promise<void> {
    const result = await this.addressRepository.delete({ id: addressId, userId, tenantId: this.tenantId });
    if (result.affected === 0) {
      throw new NotFoundException(`Address with ID ${addressId} not found or not owned by user.`);
    }
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<Address> {
    // Unset current default
    await this.addressRepository.update({ userId, tenantId: this.tenantId, isDefault: true }, { isDefault: false });
    // Set new default
    const address = await this.findAddressById(userId, addressId);
    address.isDefault = true;
    return this.addressRepository.save(address);
  }
}