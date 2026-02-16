export class Option {
  private _value: any;

  public constructor(value: any) {
    this._value = value;
  }

  public static Some(value: any) {
    return new Option(value);
  }

  public static None() {
    return new Option(null);
  }

  public static from(value: any) {
    return value === undefined || value === null ? Option.None() : Option.Some(value);
  }

  public isSome() {
    return this._value !== undefined && this._value !== null;
  }

  public isNone() {
    return !this.isSome();
  }
}
