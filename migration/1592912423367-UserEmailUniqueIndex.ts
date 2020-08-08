import { MigrationInterface } from 'typeorm';
import { MongoQueryRunner } from 'typeorm/driver/mongodb/MongoQueryRunner';

export class UserEmailUniqueIndex1592912423367 implements MigrationInterface {
  public async up(queryRunner: MongoQueryRunner): Promise<any> {
    let indexExists: boolean;
    try {
      indexExists = await queryRunner.collectionIndexExists(
        'users',
        'IDX_USER_EMAIL',
      );
    } catch (e) {
      console.log('We were not able locate index on users collection.', e);
    }

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
