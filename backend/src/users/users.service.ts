import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateProfileDto, ChangePasswordDto, UpdatePreferencesDto } from './dto/profile.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(userData: Partial<User>): Promise<User> {
        const existingUser = await this.usersRepository.findOne({
            where: { email: userData.email },
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Hash password
        if (userData.password) {
            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);
        }

        const user = this.usersRepository.create(userData);
        return this.usersRepository.save(user);
    }

    async findOneById(id: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    async update(id: string, updateData: Partial<User>): Promise<User> {
        const user = await this.findOneById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        Object.assign(user, updateData);
        return this.usersRepository.save(user);
    }

    async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User> {
        const user = await this.findOneById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Check if email is being changed and if it's already taken
        if (updateProfileDto.email && updateProfileDto.email !== user.email) {
            const existingUser = await this.findOneByEmail(updateProfileDto.email);
            if (existingUser) {
                throw new ConflictException('Email already in use');
            }
        }

        Object.assign(user, updateProfileDto);
        return this.usersRepository.save(user);
    }

    async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            select: ['id', 'password'],
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Verify current password
        const isValid = await this.validatePassword(changePasswordDto.currentPassword, user.password);

        if (!isValid) {
            throw new BadRequestException('Current password is incorrect');
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(changePasswordDto.newPassword, salt);

        await this.usersRepository.save(user);
    }

    async updatePreferences(userId: string, preferencesDto: UpdatePreferencesDto): Promise<User> {
        const user = await this.findOneById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // TODO: Add preferences field to User entity
        // Merge preferences with existing ones
        // user.preferences = {
        //     ...user.preferences,
        //     ...preferencesDto,
        // };

        return this.usersRepository.save(user);
    }

    async getProfile(userId: string): Promise<Partial<User>> {
        const user = await this.findOneById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Remove sensitive fields using destructuring
        const { password, ...profile } = user;

        return profile;
    }

    async deleteAccount(userId: string): Promise<void> {
        const user = await this.findOneById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        await this.usersRepository.remove(user);
    }
}
