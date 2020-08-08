import { User } from '../../users/user.entity';

export class Serializable<T> {
  public constructor(
    public readonly serialize: (user?: User) => Promise<T | T[]>,
  ) {}
}

export abstract class BaseSerializerService<E, T> {
  public abstract async serialize(entity: E, user?: User): Promise<T>;

  private serializeCollection(values: E[], user?: User): Promise<T[]> {
    return Promise.all<T>(values.map(value => this.serialize(value, user)));
  }

  public markSerializableValue(value: E): Serializable<T> {
    return new Serializable<T>(this.serialize.bind(this, value));
  }

  public markSerializableCollection(values: E[]): Serializable<T[]> {
    return new Serializable<T[]>(this.serializeCollection.bind(this, values));
  }
}
