import {
  BaseEntity,
  Column,
  Entity,
  ObjectID,
  ObjectIdColumn,
  Unique,
} from 'typeorm';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import * as bcrypt from 'bcrypt';
import { Exclude, Transform } from 'class-transformer';
import { MatchesUserPassword } from './decorators/MatchesUserPassword';

@Entity({ name: 'users' })
@Unique(['email'])
export class User extends BaseEntity {
  @ObjectIdColumn({ name: '_id' })
  @Transform((value: ObjectID) => value.toHexString(), { toPlainOnly: true })
  id: ObjectID;

  @IsString()
  @IsNotEmpty()
  @Column()
  name: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @Column()
  email: string;

  @MinLength(8)
  @MaxLength(10)
  @IsString()
  @MatchesUserPassword()
  @Exclude({ toPlainOnly: true })
  @Column({ select: false })
  password: string;

  @Exclude({ toPlainOnly: true })
  @Column({ select: false })
  salt: string;

  @IsOptional()
  @IsString()
  @Column()
  phoneNumber?: string;

  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);

    return hash === this.password;
  }

  async update(user: Partial<User>): Promise<User> {
    Object.assign(this, user);
    await this.save();
    return this;
  }
}
