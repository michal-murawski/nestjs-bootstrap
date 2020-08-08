import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Exclude, Transform } from 'class-transformer';
import { omit } from 'lodash';

type Layout = {
  x: number;
  y: number;
  w: number;
  h: number;
  i: string;
};
type Widget = {
  id: string;
  type: string;
  props?: {};
  name?: string;
  nlpQuery?: string;
};

export type Grid = { layouts: Layout[]; widgets: Widget[] };

const DEFAULT_GRID: Grid = {
  layouts: [],
  widgets: [],
};

/**
 * Properties: canvas, home - are very specific and are not allowed to change by any user.
 * One instance of each exists for a specific company (current case, per  database :))
 */
@Entity({ name: 'dashboards' })
export class Dashboard extends BaseEntity {
  @ObjectIdColumn()
  @Transform((value: ObjectID) => value.toHexString(), { toPlainOnly: true })
  id: ObjectID;

  @IsString()
  @IsNotEmpty()
  @Column()
  name: string;

  @IsBoolean()
  @IsOptional()
  @Column()
  canvas: boolean;

  @IsBoolean()
  @IsOptional()
  @Column()
  home: boolean;

  @IsString()
  @Column()
  @Exclude()
  ownerId: string;

  @Column({ default: DEFAULT_GRID })
  @IsOptional()
  grid: Grid;

  constructor(dashboard: Partial<Dashboard>) {
    super();
    Object.assign(this, dashboard);
  }

  async update(dashboard: Partial<Dashboard>): Promise<Dashboard> {
    Object.assign(this, omit(dashboard, ['home', 'canvas']));
    await this.save();
    return this;
  }
}
