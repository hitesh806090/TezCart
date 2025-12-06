import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { User } from 'db';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No roles specified, access granted
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as User; // User object attached by JWT strategy

    if (!user || !user.defaultPersona) {
      return false; // No user or no persona attached
    }

    // Check if user's defaultPersona matches any of the required roles
    // In a full RBAC, this would involve checking user's `roles` array from DB
    // For now, we use `defaultPersona` as a placeholder for the primary role.
    return requiredRoles.some((role) => user.defaultPersona.includes(role));
  }
}
