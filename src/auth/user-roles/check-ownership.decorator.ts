import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const CHECK_OWNERSHIP_KEY = 'check-ownership';

/**
 * Marks controller's route that makes Update/Delete operations on entity which requires owner `ID` check
 * @constructor
 */
export const CheckOwnership = () =>
  SetMetadata<typeof CHECK_OWNERSHIP_KEY, boolean>(CHECK_OWNERSHIP_KEY, true);

export const getCheckOwnership = (
  reflector: Reflector,
  context: ExecutionContext,
) => reflector.get<boolean>(CHECK_OWNERSHIP_KEY, context.getHandler());
