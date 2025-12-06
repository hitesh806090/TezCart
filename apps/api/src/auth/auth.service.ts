import { Injectable, UnauthorizedException, Inject, Scope, Request as ReqDecorator } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { SessionService } from '..//session/session.service'; // Adjust path
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { User } from 'db';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
    @Inject(REQUEST) private request: Request,
  ) {}

  async signUp(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userService.createUser({ email, passwordHash: password });
    return this.generateTokensAndSession(user);
  }

  async signIn(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userService.findOneByEmail(email);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    return this.generateTokensAndSession(user);
  }

  async refreshToken(oldRefreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const tenantId = (this.request as any).tenantId; // Get tenantId from request context
    if (!tenantId) {
      throw new UnauthorizedException('Tenant context missing.');
    }

    // Find the session by matching the hashed refresh token
    const sessions = await this.sessionService.userSessionRepository.find({
        where: { userId: null, tenantId, isValid: true } // userId will be unknown until we verify oldRefreshToken
    }); // This approach needs to be refined. A more secure way is to store RT hash with JTI.

    let matchedSession: UserSession;
    for (const session of sessions) {
      if (session.refreshTokenHash && await bcrypt.compare(oldRefreshToken, session.refreshTokenHash)) {
        matchedSession = session;
        break;
      }
    }

    if (!matchedSession || !matchedSession.isValid || matchedSession.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }

    // Invalidate the old session
    matchedSession.isValid = false;
    await this.sessionService.userSessionRepository.save(matchedSession);

    // Generate new tokens and session
    const user = await this.userService.findUserById(matchedSession.userId);
    if (!user) {
        throw new UnauthorizedException('User not found for refresh token.');
    }
    return this.generateTokensAndSession(user);
  }


  private async generateTokensAndSession(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const jti = uuidv4();
    const accessTokenExpiresIn = '15m'; // Short-lived access token
    const refreshTokenExpiresIn = '7d';  // Longer-lived refresh token

    const accessTokenPayload = {
      userId: user.id,
      email: user.email,
      tenantId: user.tenantId,
      persona: user.defaultPersona,
      jti: jti,
    };
    const accessToken = this.jwtService.sign(accessTokenPayload, { expiresIn: accessTokenExpiresIn });

    const refreshToken = uuidv4(); // Generate a unique ID for the refresh token
    const hashedRefreshToken = await this.sessionService.hashRefreshToken(refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Refresh token valid for 7 days

    // Create session record
    await this.sessionService.createSession({
      jti: jti,
      userId: user.id,
      tenantId: user.tenantId,
      refreshTokenHash: hashedRefreshToken,
      expiresAt: expiresAt, // This refers to refresh token expiry for session tracking
      ipAddress: this.request.ip,
      userAgent: this.request.headers['user-agent'],
      lastActivityAt: new Date(),
      isValid: true,
    });

    return { accessToken, refreshToken };
  }
}
