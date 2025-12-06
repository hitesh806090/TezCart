import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantProvider } from '../tenant.module';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(
    private readonly tenantProvider: TenantProvider,
    private readonly asyncLocalStorage: AsyncLocalStorage<any>, // Inject AsyncLocalStorage
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Ensure that asyncLocalStorage.getStore() returns a valid context for TenantProvider
    this.asyncLocalStorage.run({}, () => {
      const tenantId = req.headers['x-tenant-id'] as string;

      if (!tenantId) {
        // For now, allow requests without tenantId to proceed,
        // but throw UnauthorizedException if tenantId is missing for protected routes
        // or during specific operations that require a tenant.
        // Later, we might want a stricter global check or specific guards.
        console.warn('x-tenant-id header is missing for request:', req.url);
      }
      (this.asyncLocalStorage.getStore() as any).tenantId = tenantId;
      next();
    });
  }
}
