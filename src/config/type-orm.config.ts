import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getEnvConfigs } from './env.config';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  host: getEnvConfigs().MONGODB_HOST,
  port: 27017,
  retryDelay: 5000,
  database: 'portal-db',
  useUnifiedTopology: true,
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
};
