import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    return this.usersService.create({
      ...userDto,
      password: hashedPassword,
    });
  }

  async ensureAdminUser(): Promise<void> {
    const ADMIN_EMAIL = 'tezcart@gmail.com';
    const ADMIN_PASSWORD = 'tezcart'; // This should ideally be an environment variable

    let adminUser = await this.usersService.findByEmail(ADMIN_EMAIL);

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      adminUser = await this.usersService.create({
        email: ADMIN_EMAIL,
        password: hashedPassword,
        name: 'TezCart Admin',
        role: UserRole.ADMIN,
      });
      console.log('Admin user created:', adminUser.email);
    } else {
      console.log('Admin user already exists:', adminUser.email);
    }
  }
}
