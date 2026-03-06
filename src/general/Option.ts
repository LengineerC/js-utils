/**
 * Option 类型，表示一个可选值，可能是某个值(T)或者空(None)
 * @typeParam T - Some 变体中包含的值的类型
 */
export class Option<T> {
  private readonly _value: T | undefined | null;

  public constructor(value: T | undefined | null) {
    this._value = value;
  }

  /**
   * 创建一个包含值的 Option
   * @param value - 要包装的值
   * @returns 包含该值的 Option
   */
  public static Some<T>(value: T) {
    return new Option(value);
  }

  /**
   * 创建一个空值 Option
   * @returns 空值的 Option
   */
  public static None<T = never>() {
    return new Option<T>(null);
  }

  /**
   * 根据值创建 Option，如果值为 null 或 undefined 则返回 None，否则返回 Some
   * @param value - 要转换的值
   * @returns 如果值不为 null 和 undefined 返回 Some，否则返回 None
   */
  public static from<T>(value: T | undefined | null) {
    return value === undefined || value === null ? Option.None() : Option.Some(value);
  }

  /**
   * 判断是否为 Some（有值）
   * @returns 如果包含值返回 true，否则返回 false
   */
  public isSome() {
    return this._value !== undefined && this._value !== null;
  }

  /**
   * 判断是否为 None（无值）
   * @returns 如果为 None 返回 true，否则返回 false
   */
  public isNone() {
    return !this.isSome();
  }

  /**
   * 如果是 Some，则使用函数转换内部值；如果是 None，则返回 None
   * @param fn - 转换函数
   * @returns 转换后的 Option
   */
  public map<U>(fn: (val: T) => U) {
    return this.isSome() ? Option.Some(fn(this._value as T)) : Option.None<U>();
  }

  /**
   * 获取内部值，如果是 None 则抛出错误
   * @returns 内部值
   * @throws 如果值为 None 则抛出错误
   */
  public unwrap() {
    if (this.isNone()) throw new Error('Option.unwrap(): value is None');

    return this._value as T;
  }

  /**
   * 获取内部值，如果是 None 则返回默认值
   * @param defaultValue - 默认值
   * @returns 内部值或默认值
   */
  public unwrapOr(defaultValue: T) {
    if (this.isNone()) return defaultValue;

    return this._value as T;
  }
}
