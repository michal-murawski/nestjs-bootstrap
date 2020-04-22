export class Serializable<T> {
  public constructor(public readonly serialize: () => Promise<T | T[]>) {}
}

export abstract class BaseSerializerService<E, T> {
  public abstract async serialize(entity: E): Promise<T>;

  private serializeCollection(values: E[]): Promise<T[]> {
    return Promise.all<T>(values.map(value => this.serialize(value)));
  }

  public markSerializableValue(value: E): Serializable<T> {
    return new Serializable<T>(this.serialize.bind(this, value));
  }

  public markSerializableCollection(values: E[]): Serializable<T[]> {
    return new Serializable<T[]>(this.serializeCollection.bind(this, values));
  }
}
