import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../../../packages/db/src/user.entity';
import { TenantProvider } from '../../common/tenant.module';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly tenantProvider: TenantProvider,
  ) {}

  private get tenantId(): string {
    const tenantId = this.tenantProvider.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing.');
    }
    return tenantId;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email, tenantId: this.tenantId } });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const existingUser = await this.findOneByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists in this tenant.');
    }

    const hashedPassword = await bcrypt.hash(userData.passwordHash, 10);
    const user = this.userRepository.create({
      ...userData,
      passwordHash: hashedPassword,
      tenantId: this.tenantId,
    });
    return this.userRepository.save(user);
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id, tenantId: this.tenantId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  async updateUser(userId: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findUserById(userId); // Ensures user exists and belongs to the tenant
    
    // Prevent updating tenantId or email directly via this method if not intended
    if (updateData.tenantId && updateData.tenantId !== user.tenantId) {
        throw new ConflictException('Tenant ID cannot be changed.');
    }
    if (updateData.email && updateData.email !== user.email) {
        // Implement email verification flow here
        throw new ConflictException('Email change requires separate verification flow.');
    }
    // Handle password change separately if needed, with old password verification

    this.userRepository.merge(user, updateData);
    return this.userRepository.save(user);
  }

  // Other CRUD operations for user management can be added here
}
