import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../audit.service';
import { TenantProvider } from '../../common/tenant.module'; // Adjust path as needed
import { Request } from 'express';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly auditService: AuditService,
    private readonly tenantProvider: TenantProvider,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, ip, body } = request;

    // We'll refine `userId`, `userEmail`, `entityType`, `entityId`, `oldValue` capturing later.
    // For now, capture basics for write operations.
    const isWriteOperation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

    if (!isWriteOperation) {
      return next.handle();
    }

    const startTime = Date.now();

    return next.handle().pipe(
      tap(async (responseBody) => {
        const tenantId = this.tenantProvider.tenantId;
        const userId = (request as any).user?.id; // Assuming user is attached by auth middleware
        const userEmail = (request as any).user?.email;

        // Basic entityType and entityId extraction from URL for demo purposes.
        // This needs to be more robust in a real application.
        const urlParts = url.split('/');
        let entityType: string | undefined;
        let entityId: string | undefined;

        // Example: /tenant-config/some-id -> entityType: 'TenantConfig', entityId: 'some-id'
        if (urlParts.length >= 2) {
          entityType = urlParts[1]; // e.g., 'tenant-config'
          if (urlParts.length >= 3) {
            entityId = urlParts[2]; // e.g., 'some-id'
          }
        }

        // Further logic for capturing oldValue (pre-update snapshot)
        // would go here, possibly by fetching the entity from the DB before the controller method executes
        // and storing it in the request object, then comparing with the new value from the responseBody.

        await this.auditService.createAuditLog({
          tenantId: tenantId || 'system', // Default to 'system' if no tenantId for global actions
          userId,
          userEmail,
          action: method,
          entityType: entityType || 'Unknown',
          entityId,
          newValue: responseBody, // For POST/PUT/PATCH, responseBody is often the new state
          oldValue: undefined, // To be implemented for PUT/PATCH
          ipAddress: ip,
          userAgent: request.headers['user-agent'],
          endpoint: url,
          createdAt: new Date(),
          correlationId: (request as any).correlationId || `${Date.now()}-${Math.random().toString(36).substring(7)}`,
        });
        console.log(`Audit Logged for [${method}] ${url} in ${Date.now() - startTime}ms`);
      }),
    );
  }
}
