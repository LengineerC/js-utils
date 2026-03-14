/**
 * Result 类型，表示一个操作的结果，可能是成功(T)或者失败(E)
 * @typeParam T - Ok 变体中包含的成功值的类型
 * @typeParam E - Err 变体中包含的错误值的类型
 */
export class Result<T, E> {
  private readonly _value: T | E;
  private readonly _isOk: boolean;

  public constructor(value: T | E, isOk: boolean) {
    this._value = value;
    this._isOk = isOk;
  }

  /**
   * 创建一个成功结果的 Result
   * @param val - 成功的值
   * @returns 成功结果的 Result
   */
  static Ok<T, E = never>(val: T): Result<T, E> {
    return new Result<T, E>(val, true);
  }

  /**
   * 创建一个错误结果的 Result
   * @param err - 错误的值
   * @returns 错误结果的 Result
   */
  static Err<E, T = never>(err: E): Result<T, E> {
    return new Result<T, E>(err, false);
  }
  /**
   * 包装一个可能抛出异常的函数为 Result 类型
   * @param fn - 可能抛出异常的函数
   * @returns 成功返回 Ok，异常返回 Err
   */
  static fromThrowable<T, E = Error>(fn: () => T): Result<T, E> {
    try {
      return Result.Ok(fn());
    } catch (e) {
      return Result.Err(e as E);
    }
  }

  /**
   * 判断是否为成功结果
   * @returns 如果是成功结果返回 true，否则返回 false
   */
  isOk(): boolean {
    return this._isOk;
  }

  /**
   * 判断是否为错误结果
   * @returns 如果是错误结果返回 true，否则返回 false
   */
  isErr(): boolean {
    return !this._isOk;
  }

  /**
   * 如果是 Ok，则使用函数转换内部值；如果是 Err，则返回 Err
   * @param fn - 转换函数
   * @returns 转换后的 Result
   */
  map<U>(fn: (val: T) => U): Result<U, E> {
    return this.isOk() ? Result.Ok(fn(this._value as T)) : Result.Err(this._value as E);
  }

  /**
   * 链式调用，如果是 Ok 则执行函数返回新的 Result，如果是 Err 则返回 Err
   * @param fn - 返回 Result 的函数
   * @returns 链式调用的 Result
   */
  andThen<U>(fn: (val: T) => Result<U, E>): Result<U, E> {
    return this.isOk() ? fn(this._value as T) : Result.Err(this._value as E);
  }

  /**
   * 获取内部值，如果是 Err 则返回默认值
   * @param defaultValue - 默认值
   * @returns 成功值或默认值
   */
  unwrapOr(defaultValue: T): T {
    return this.isOk() ? (this._value as T) : defaultValue;
  }

  /**
   * 获取内部值，如果是 None 则抛出错误
   * @returns 内部值
   * @throws 如果值为 None 则抛出错误
   */
  unwrap(): T {
    if (this.isErr()) {
      const errorDetail = this._value instanceof Error ? this._value.message : String(this._value);
      throw new Error(`Result.unwrap(): ${errorDetail}`);
    }

    return this._value as T;
  }

  /**
   * 模式匹配，根据是 Ok 还是 Err 执行对应的函数
   * @param cases - 包含 Ok 和 Err 处理函数的对象
   * @returns 对应分支的返回值
   */
  match<U>(cases: { Ok: (val: T) => U; Err: (err: E) => U }): U {
    return this.isOk() ? cases.Ok(this._value as T) : cases.Err(this._value as E);
  }
}
