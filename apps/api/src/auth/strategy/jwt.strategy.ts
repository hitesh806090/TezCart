import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { TenantProvider } from '../../common/tenant.module';
import { SessionService } from '../../session/session.service'; // Import SessionService
import { User } from 'db';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly tenantProvider: TenantProvider,
    private readonly sessionService: SessionService, // Inject SessionService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any): Promise<User> {
    const { userId, email, tenantId, persona, jti, exp } = payload; // Extract jti and exp

    // 1. Tenant ID verification
    const requestTenantId = this.tenantProvider.tenantId;
    if (!requestTenantId || requestTenantId !== tenantId) {
      throw new UnauthorizedException('Tenant context mismatch or missing.');
    }

    // 2. JTI and Session validity verification
    if (!jti) {
      throw new UnauthorizedException('JWT ID (jti) missing from token.');
    }

    const session = await this.sessionService.findSessionByJti(jti);
    if (!session || !session.isValid) {
      throw new UnauthorizedException('Invalid or expired session.');
    }

    // Update last activity for the session
    await this.sessionService.updateLastActivity(jti);

    // 3. User existence and activity check
    const user = await this.userService.findUserById(userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive.');
    }

    // Attach roles/persona and jti to the user object for guards and logout
    (user as any).defaultPersona = persona; // Ensure persona is available for RolesGuard
    (user as any).jti = jti; // Attach jti to user object

    return user;
  }
}