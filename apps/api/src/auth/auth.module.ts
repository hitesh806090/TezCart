import { Module, Scope } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { TenantModule } from '../common/tenant.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SessionModule } from '../session/session.module'; // Import SessionModule
import { REQUEST } from '@nestjs/core';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' }, // Token expiration
      }),
    }),
    TenantModule,
    SessionModule, // Add SessionModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    // Provide REQUEST as request-scoped for AuthService constructor injection
    {
      provide: REQUEST,
      useValue: {}, // This will be replaced by the actual request object by NestJS
      scope: Scope.REQUEST,
    },
  ],
  exports: [AuthService, JwtModule, JwtAuthGuard, PassportModule],
})
export class AuthModule {}
