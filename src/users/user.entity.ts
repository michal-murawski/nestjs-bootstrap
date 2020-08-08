import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import * as bcrypt from 'bcrypt';
import { Exclude, Transform } from 'class-transformer';
import { UserRole } from '../auth/user-roles/user-role';
import { MatchesUserPassword } from '../auth/decorators/MatchesUserPassword';

@Entity({ name: 'users' })
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
  @Index({ unique: true })
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

  @IsNotEmpty()
  @IsEnum(UserRole)
  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  async validatePassword(password: string): Promise<boolean> {
    const hash = await this.hashPassword(password);

    return hash === this.password;
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.salt);
  }

  async update(user: Partial<User>): Promise<User> {
    Object.assign(this, user);
    await this.save();
    return this;
  }
}
