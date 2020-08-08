import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getMongoRepository } from 'typeorm';
import { User } from '../../users/user.entity';
import { UserRole } from './user-role';
import { getCheckOwnership } from './check-ownership.decorator';
import { get } from 'lodash';
import { Constructor } from '../../common/types';

/**
 * Factory function that return actual guard. Always needs to be called.
 * If `@CheckOwnership` decorator is used, then we need to use this Guard on a controller
 * and provide `Entity` (and optionally different keys for Entity ID value and request ID source)
 */
export function OwnershipGuard<Entity>(
  entity: Constructor<Entity>,
  ownershipCompareKey: keyof Entity | string = 'ownerId',
  ownershipRequestPath = 'params.id',
): any {
  @Injectable()
  class AdminOrOwnerGuardHost implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest();
      const user = req.user as User;
      const checkOwnership = getCheckOwnership(this.reflector, context);

      if (!checkOwnership) {
        return true;
      }

      if (user.role === UserRole.ADMIN) {
        return true;
      }

      const found = await getMongoRepository(entity).findOne(
        get(req, ownershipRequestPath),
      );
      const isEntityOwner =
        get(found, ownershipCompareKey) === user.id.toHexString();

      if (!isEntityOwner) {
        throw new ForbiddenException('You are not the owner of this entity.');
      }

      return true;
    }
  }

  return AdminOrOwnerGuardHost;
}
