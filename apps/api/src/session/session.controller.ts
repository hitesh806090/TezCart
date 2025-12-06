import { Controller, Post, Param, Body, HttpCode, HttpStatus, UseGuards, Request, Get } from '@nestjs/common';
import { SessionService } from './session.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from 'db';

class InvalidateSessionDto {
  jti: string; // The JWT ID of the session to invalidate
}

@ApiTags('Session Management')
@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('invalidate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async invalidateSession(@Body() invalidateSessionDto: InvalidateSessionDto, @Request() req: { user: User }) {
    // Ensure the user is only invalidating their own session for security
    // Or add RBAC for admins to invalidate others' sessions
    const session = await this.sessionService.findSessionByJti(invalidateSessionDto.jti);
    if (session && session.userId === req.user.id) {
      await this.sessionService.invalidateSession(invalidateSessionDto.jti);
    } else {
      // Potentially throw NotFound or Forbidden if trying to invalidate someone else's session
      throw new Error('Session not found or not authorized to invalidate.');
    }
  }

  @Post('invalidate-all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async invalidateAllSessions(@Request() req: { user: User }) {
    await this.sessionService.invalidateAllUserSessions(req.user.id);
  }

  // A GET endpoint to list active sessions for the current user could also be added here
  // For brevity, I'll omit it for now.
}