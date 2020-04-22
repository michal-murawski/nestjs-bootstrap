import * as bcrypt from 'bcrypt';
import { User } from '../user.entity';

const DEFAULT_USER = {
  name: 'Test User',
  email: 'test@select.ai',
  password: bcrypt.hashSync('Agent$m1th', '$2b$10$ho7BPKuxvf4j0dsSfH.mZO'),
  salt: '$2b$10$ho7BPKuxvf4j0dsSfH.mZO',
};

export const findDefaultUser = async () => {
  return User.findOne({ where: { email: DEFAULT_USER.email } });
};

export const createDefaultUser = async () => {
  console.log('Finding existing default user...');
  try {
    const existingDefaultUser = await findDefaultUser();
    if (existingDefaultUser) {
      console.log('Default user already exists.');
    } else {
      const user = await User.create(DEFAULT_USER);
      await user.save();
      console.log(
        `Default user '${DEFAULT_USER.email}' has been successful created.`,
      );
    }
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
