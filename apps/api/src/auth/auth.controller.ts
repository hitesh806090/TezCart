import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from 'db';

class SignUpDto {
  email: string;
  password: string;
}

class SignInDto {
  email: string;
  password: string;
}

class RefreshTokenDto {
  refreshToken: string;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto.email, signUpDto.password);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Request() req: { user: User }) {
    // Invalidate the current session associated with the JWT's jti
    // This assumes `req.user` contains `jti` from the JWT payload
    const jti = (req.user as any).jti;
    if (jti) {
        await this.authService.sessionService.invalidateSession(jti);
    } else {
        // This case should ideally not happen if JwtAuthGuard is working correctly
        // and JwtStrategy attaches jti to req.user.
        // For now, if jti is missing, consider invalidating all user sessions as a fallback
        // or throw an error indicating a misconfiguration.
        await this.authService.sessionService.invalidateAllUserSessions(req.user.id);
    }
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async logoutAll(@Request() req: { user: User }) {
    await this.authService.sessionService.invalidateAllUserSessions(req.user.id);
  }
}
