import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getUserRoleWeight, UserRole } from './user-role';
import { User } from '../../users/user.entity';
import { getRoles } from './user-roles.decorator';

export function matchRoles(
  requiredRole: UserRole,
  userRole: UserRole,
): boolean {
  return getUserRoleWeight(requiredRole) <= getUserRoleWeight(userRole);
}

/**
 * Checks whether the logged user has proper role settings
 * in order to execute marked request
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = getRoles(this.reflector, context);
    if (!requiredRole) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;
    const allowed = matchRoles(requiredRole, user.role);
    if (!allowed) {
      throw new ForbiddenException(
        'You do not have proper rights to execute this request.',
      );
    }
    return allowed;
  }
}
