import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from 'db';

@Injectable()
export class TenantConfigService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async createTenant(createTenantDto: any): Promise<Tenant> {
    const tenant = this.tenantRepository.create(createTenantDto);
    return this.tenantRepository.save(tenant);
  }

  async findAllTenants(): Promise<Tenant[]> {
    return this.tenantRepository.find();
  }

  async findTenantById(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({ where: { id } });
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant;
  }

  async findTenantByCode(code: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({ where: { code } });
    if (!tenant) {
      throw new NotFoundException(`Tenant with code ${code} not found`);
    }
    return tenant;
  }

  async updateTenant(id: string, updateTenantDto: any): Promise<Tenant> {
    const tenant = await this.findTenantById(id); // Ensure tenant exists
    this.tenantRepository.merge(tenant, updateTenantDto);
    return this.tenantRepository.save(tenant);
  }

  async deleteTenant(id: string): Promise<void> {
    const result = await this.tenantRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
  }
}