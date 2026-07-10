import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/auth.decorators';
import { UserRole, ROLE_HIERARCHY } from '../../modules/users/enums/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles?.length) return true;

    const { user } = context.switchToHttp().getRequest();
    const userRole = user?.role as UserRole;

    if (!userRole) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Insufficient permissions' });
    }

    const userLevel = ROLE_HIERARCHY[userRole] ?? 0;
    const requiredLevel = Math.min(...requiredRoles.map((r) => ROLE_HIERARCHY[r] ?? 0));

    if (userLevel < requiredLevel) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Insufficient permissions' });
    }

    return true;
  }
}
