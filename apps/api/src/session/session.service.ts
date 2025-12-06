import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSession } from 'db';
import { TenantProvider } from '..//common/tenant.module';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,
    private readonly tenantProvider: TenantProvider,
  ) {}

  async createSession(sessionData: Partial<UserSession>): Promise<UserSession> {
    const tenantId = this.tenantProvider.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing.');
    }
    const userSession = this.userSessionRepository.create({
      ...sessionData,
      tenantId,
      lastActivityAt: new Date(),
    });
    return this.userSessionRepository.save(userSession);
  }

  async findSessionByJti(jti: string): Promise<UserSession | undefined> {
    const tenantId = this.tenantProvider.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing.');
    }
    return this.userSessionRepository.findOne({ where: { jti, tenantId, isValid: true } });
  }

  async invalidateSession(jti: string): Promise<void> {
    const tenantId = this.tenantProvider.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing.');
    }
    const session = await this.userSessionRepository.findOne({ where: { jti, tenantId } });
    if (session) {
      session.isValid = false;
      await this.userSessionRepository.save(session);
    }
  }

  async invalidateAllUserSessions(userId: string): Promise<void> {
    const tenantId = this.tenantProvider.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing.');
    }
    await this.userSessionRepository.update(
      { userId, tenantId, isValid: true },
      { isValid: false },
    );
  }

  async updateLastActivity(jti: string): Promise<void> {
    const tenantId = this.tenantProvider.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing.');
    }
    await this.userSessionRepository.update(
      { jti, tenantId, isValid: true },
      { lastActivityAt: new Date() },
    );
  }

  // Helper to hash refresh tokens
  async hashRefreshToken(token: string): Promise<string> {
    return bcrypt.hash(token, 10);
  }

  // Helper to compare refresh tokens
  async compareRefreshToken(token: string, hash: string): Promise<boolean> {
    return bcrypt.compare(token, hash);
  }
}