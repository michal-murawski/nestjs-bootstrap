import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { applyDecorators } from '@nestjs/common';

export function MatchesUserPassword() {
  return applyDecorators(
    IsNotEmpty(),
    IsString(),
    MinLength(8),
    MaxLength(10),
    Matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/,
      {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
      },
    ) as any,
  );
}
