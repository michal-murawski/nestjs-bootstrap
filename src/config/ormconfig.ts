import { typeOrmConfig } from './type-orm.config';

// Problems with type TypeORM CLI config files. We are not able to use TS exports and need to use another type.
// In order to avoid strange imports, syntax we are exporting this config for TypeORM CLI only.
// https://github.com/typeorm/typeorm/issues/2828
export = { ...typeOrmConfig };
