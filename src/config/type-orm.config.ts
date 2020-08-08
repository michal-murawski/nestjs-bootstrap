import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getEnvConfigs } from './env.config';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import * as path from 'path';

// detecting running in ts-node/node
const isTsNode = Boolean(process[Symbol.for('ts-node.register.instance')]);
const migrationDir = 'migration';

export const typeOrmConfig: TypeOrmModuleOptions & MongoConnectionOptions = {
  type: 'mongodb',
  host: getEnvConfigs().MONGODB_HOST,
  port: getEnvConfigs().MONGODB_PORT,
  retryDelay: 5000,
  database: 'app-db',
  useUnifiedTopology: true,
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  migrationsRun: true,
  migrations: [
    path.resolve(
      isTsNode ? `${migrationDir}/*.ts` : `dist/${migrationDir}/*.js`,
    ),
  ],
  cli: {
    migrationsDir: migrationDir,
  },
  synchronize: false,
  logging: true,
};
