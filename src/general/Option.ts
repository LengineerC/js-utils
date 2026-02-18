export class Option<T> {
  private readonly _value: T | undefined | null;

  public constructor(value: T | undefined | null) {
    this._value = value;
  }

  public static Some<T>(value: T) {
    return new Option(value);
  }

  public static None<T = never>() {
    return new Option<T>(null);
  }

  public static from<T>(value: T | undefined | null) {
    return value === undefined || value === null ? Option.None() : Option.Some(value);
  }

  public isSome() {
    return this._value !== undefined && this._value !== null;
  }

  public isNone() {
    return !this.isSome();
  }

  public map<U>(fn: (val: T) => U) {
    return this.isSome() ? Option.Some(fn(this._value as T)) : Option.None<U>();
  }

  public unwrap() {
    if (this.isNone()) throw new Error('Option.unwrap(): value is None');

    return this._value as T;
  }

  public unwrapOr(defaultValue: T) {
    if (this.isNone()) return defaultValue;

    return this._value as T;
  }
}
