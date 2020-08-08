import * as bcrypt from 'bcrypt';
import { User } from '../user.entity';
import { UserRole } from '../../auth/user-roles/user-role';

const ADMIN_USER = {
  name: 'Test Admin User',
  email: 'test@select.ai',
  password: bcrypt.hashSync('Agent$m1th', '$2b$10$ho7BPKuxvf4j0dsSfH.mZO'),
  role: UserRole.ADMIN,
  salt: '$2b$10$ho7BPKuxvf4j0dsSfH.mZO',
};

const REGULAR_USER = {
  name: 'Test Regular User',
  email: 'regular@select.ai',
  password: bcrypt.hashSync('Agent$m1th', '$2b$10$ho7BPKuxvf4j0dsSfH.mZO'),
  role: UserRole.REGULAR,
  salt: '$2b$10$ho7BPKuxvf4j0dsSfH.mZO',
};

const READONLY_USER = {
  name: 'Test Readonly User',
  email: 'readonly@select.ai',
  password: bcrypt.hashSync('Agent$m1th', '$2b$10$ho7BPKuxvf4j0dsSfH.mZO'),
  role: UserRole.READONLY,
  salt: '$2b$10$ho7BPKuxvf4j0dsSfH.mZO',
};

const DEFAULT_USERS = [ADMIN_USER, READONLY_USER, REGULAR_USER];

export const findDefaultUser = async (email: string = ADMIN_USER.email) => {
  return User.findOne({ where: { email } });
};

export const createDefaultUsers = async () => {
  try {
    for (const DEFAULT_USER of DEFAULT_USERS) {
      console.log(`Finding existing ${DEFAULT_USER.email} user...`);
      const existingDefaultUser = await findDefaultUser(DEFAULT_USER.email);
      if (existingDefaultUser) {
        console.log(`Default user ${DEFAULT_USER.email} already exists.`);
        continue;
      }
      const user = await User.create(DEFAULT_USER);
      await user.save();
      console.log(
        `Default user '${DEFAULT_USER.email}' with role ${DEFAULT_USER.role} has been successful created.`,
      );
    }
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
