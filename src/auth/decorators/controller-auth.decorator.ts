import { applyDecorators, Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { RolesGuard } from '../user-roles/user-roles.guard';
import { compact } from 'lodash';
import { OwnershipGuard } from '../user-roles/ownership.guard';
import { Constructor } from '../../common/types';

/**
 * Composes most common decorators for each controller
 */
export const ControllerAuth = <T>(
  controllerName: string,
  entity?: Constructor<T>,
  ownershipCompareKey?: keyof T | string,
  ownershipRequestPath?: string,
) => {
  const guards = compact([
    JwtAuthGuard,
    RolesGuard,
    entity && OwnershipGuard(entity, ownershipCompareKey, ownershipRequestPath),
  ]);

  return applyDecorators(
    ApiTags(controllerName),
    ApiBearerAuth(),
    Controller(controllerName),
    UseGuards(...guards),
  );
};
