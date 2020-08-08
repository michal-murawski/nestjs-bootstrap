import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { UserRole } from './user-role';
import { Reflector } from '@nestjs/core';

export const ROLES_METADATA_KEY = 'roles';

export type RolesMetadata = UserRole;

/**
 * Marks controller's route that need to be protected for unauthorized users
 */
export const Roles = (role: UserRole) =>
  SetMetadata<typeof ROLES_METADATA_KEY, RolesMetadata>(
    ROLES_METADATA_KEY,
    role,
  );

export const getRoles = (reflector: Reflector, context: ExecutionContext) =>
  reflector.get<RolesMetadata>(ROLES_METADATA_KEY, context.getHandler());
