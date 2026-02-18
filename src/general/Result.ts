export class Result<T, E> {
  private readonly _value: T | E;
  private readonly _isOk: boolean;

  public constructor(value: T | E, isOk: boolean) {
    this._value = value;
    this._isOk = isOk;
  }

  static Ok<T, E = never>(val: T): Result<T, E> {
    return new Result<T, E>(val, true);
  }

  static Err<E, T = never>(err: E): Result<T, E> {
    return new Result<T, E>(err, false);
  }
  static fromThrowable<T, E = Error>(fn: () => T): Result<T, E> {
    try {
      return Result.Ok(fn());
    } catch (e) {
      return Result.Err(e as E);
    }
  }

  isOk(): boolean {
    return this._isOk;
  }

  isErr(): boolean {
    return !this._isOk;
  }

  map<U>(fn: (val: T) => U): Result<U, E> {
    return this.isOk() ? Result.Ok(fn(this._value as T)) : Result.Err(this._value as E);
  }

  andThen<U>(fn: (val: T) => Result<U, E>): Result<U, E> {
    return this.isOk() ? fn(this._value as T) : Result.Err(this._value as E);
  }

  unwrapOr(defaultValue: T): T {
    return this.isOk() ? (this._value as T) : defaultValue;
  }

  match<U>(cases: { Ok: (val: T) => U; Err: (err: E) => U }): U {
    return this.isOk() ? cases.Ok(this._value as T) : cases.Err(this._value as E);
  }
}
