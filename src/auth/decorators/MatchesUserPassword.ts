import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { applyDecorators } from '@nestjs/common';

// WARNING! Every change in this schema should be reflected in /portal/client login-page.component.tsx passwordSchema
// and in input-password.hint.component.tsx validation!
export function MatchesUserPassword() {
  return applyDecorators(
    IsNotEmpty(),
    IsString(),
    MinLength(5),
    Matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/,
      {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
      },
    ) as any,
  );
}
