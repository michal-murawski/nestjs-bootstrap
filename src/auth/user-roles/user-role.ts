/**
 * For now we are just using simple `enum`
 * for user roles and calculate ech enum value's weight
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  REGULAR = 'REGULAR',
  READONLY = 'READONLY',
}

const USER_ROLE_WEIGHT: Record<UserRole, number> = {
  [UserRole.ADMIN]: 3,
  [UserRole.REGULAR]: 2,
  [UserRole.READONLY]: 1,
};

export const getUserRoleWeight = (userRole: UserRole) =>
  USER_ROLE_WEIGHT[userRole];
