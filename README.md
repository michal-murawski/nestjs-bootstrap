## Description

Portal service backend written in [Nest](https://github.com/nestjs/nest).

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Database, TypeORM

#### TypeORM configuration

Inside type-orm.config file:

- **migrations** - as we might have our migrations running in a local environment (testing, developing) we need to check for a current node instance. From this [GH topic](https://github.com/typeorm/typeorm/issues/5103). After build our migrations will be transpiled as *.*js\* in a /dist directory
- **cli/migrationsDir** - location where `typeorm-cli` should create migrations files
- **migrationsRun** - after connection with database TypeORM checks for a new migration in a **migrations** directory location. After each successful run a migration name is saved in a database inside the migration table that was created automatically after the first run

#### TypeORM CLI scripts

Npm scripts:

- `typeorm:cli` - We need a ts-node in order to run the node environment with typescript.
- `db:migration:create` - creates our an empty migration with provided parameters

  - we need to call those scripts: `npm run db:migration:create -- -n TestMigration`
  - `--` in order to pass next bash arguments into the called script

- `db:migration:generate` - creates new migration based on a schema change - did not work with that yet.
- `db:migration:run` - runs all the migrations that are no saved in **migrations** table/collection
- `db:migration:show` - shows all the migrations and information whether they were resolved, failed or not initialized yet

#### Example migrations

###### Removing duplicated users

```typescript jsx
export class RemoveDuplicateUsers1592828054887 implements MigrationInterface {
  public async up(): Promise<any> {
    const repositoryUsers = await getRepository(User);
    const repositoryDashboards = await getRepository(Dashboard);
    const repositoryFolders = await getRepository(Folder);
    const users = await repositoryUsers.find();

    const duplicates = chain(users)
      .groupBy('email')
      .map(value => value)
      .filter(users => users.length > 1)
      .value();

    for (const duplicatedUserEntities of duplicates) {
      const targetUser = duplicatedUserEntities.pop(); // latest user
      const targetUserId = targetUser.id.toHexString();

      for (const toRemoveUser of duplicatedUserEntities) {
        const dashboards = await repositoryDashboards.find({
          where: { ownerId: toRemoveUser.id.toHexString() },
        });
        for (const dashboard of dashboards) {
          dashboard.ownerId = targetUserId;
          await dashboard.update({ ownerId: targetUserId });
        }

        const folders = await repositoryFolders.find({
          where: { ownerId: toRemoveUser.id.toHexString() },
        });

        for (const folder of folders) {
          folder.ownerId = targetUserId;
          await folder.update({ ownerId: targetUserId });
        }
      }

      await repositoryUsers.remove(duplicatedUserEntities);
    }
  }

  public async down(): Promise<any> {
    console.log('Migration down.');
  }
}
```

We can use `queryRunner` or external methods provided by `typeorm` to access specific repositories in our database.
In this example, we are finding all the possible users duplicates by email and removing the oldest one.
During that, we find all the folders and dashboards that belong to duplicated users and then assign them to the ones
that will persist. We have a strong belief this operation will succeed - the reason why there is no `down` implementation :)

###### Adding a unique index to the collection

```typescript
export class UserEmailUniqueIndex1592912423367 implements MigrationInterface {
  public async up(queryRunner: MongoQueryRunner): Promise<any> {
    const indexExists = await queryRunner.collectionIndexExists(
      'users',
      'IDX_USER_EMAIL',
    );

    if (!indexExists) {
      await queryRunner.createCollectionIndex('users', 'email', {
        unique: true,
        name: 'IDX_USER_EMAIL',
      });
    }
  }

  public async down(): Promise<any> {
    console.log('Migration down.');
  }
}
```

Here, on the other hand, we are using `queryRunner` to add a unique index to the already existing column.
Firstly, we verify if the index exists, and if not we add it to the collection.
We check it in case our `NestJS` decorator in `user.entity.ts` adds this on its own.

#### Running migrations

After a release to the production branch and after TypeORM initial connection with the
database our migrations will run automatically thank the **migrationsRun.**
