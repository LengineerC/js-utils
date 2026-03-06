import { Option } from '../../src';

describe('Option', () => {
  describe('Some', () => {
    test('创建包含值的 Option', () => {
      const option = Option.Some(42);
      expect(option.isSome()).toBe(true);
      expect(option.isNone()).toBe(false);
      expect(option.unwrap()).toBe(42);
    });

    test('Some 值可以为 0 和 false', () => {
      const optionZero = Option.Some(0);
      const optionFalse = Option.Some(false);

      expect(optionZero.isSome()).toBe(true);
      expect(optionZero.unwrap()).toBe(0);

      expect(optionFalse.isSome()).toBe(true);
      expect(optionFalse.unwrap()).toBe(false);
    });
  });

  describe('None', () => {
    test('创建空值 Option', () => {
      const option = Option.None();
      expect(option.isNone()).toBe(true);
      expect(option.isSome()).toBe(false);
    });

    test('None unwrap 抛出错误', () => {
      const option = Option.None();
      expect(() => option.unwrap()).toThrow('Option.unwrap(): value is None');
    });

    test('None unwrapOr 返回默认值', () => {
      const option = Option.None<number>();
      expect(option.unwrapOr(0)).toBe(0);
    });
  });

  describe('from', () => {
    test('非 null 和 undefined 值返回 Some', () => {
      expect(Option.from(42).isSome()).toBe(true);
      expect(Option.from('hello').isSome()).toBe(true);
      expect(Option.from(0).isSome()).toBe(true);
      expect(Option.from(false).isSome()).toBe(true);
    });

    test('null 值返回 None', () => {
      expect(Option.from(null).isNone()).toBe(true);
    });

    test('undefined 值返回 None', () => {
      expect(Option.from(undefined).isNone()).toBe(true);
    });
  });

  describe('map', () => {
    test('Some 值映射', () => {
      const result = Option.Some(5).map(x => x * 2);
      expect(result.unwrap()).toBe(10);
    });

    test('None 映射返回 None', () => {
      const result = Option.None<number>().map(x => x * 2);
      expect(result.isNone()).toBe(true);
    });

    test('映射可以改变类型', () => {
      const result = Option.Some(5).map(x => x.toString());
      expect(result.unwrap()).toBe('5');
    });
  });

  describe('unwrap', () => {
    test('Some 获取值', () => {
      expect(Option.Some(10).unwrap()).toBe(10);
    });

    test('None 抛出错误', () => {
      expect(() => Option.None().unwrap()).toThrow();
    });
  });

  describe('unwrapOr', () => {
    test('Some 返回内部值', () => {
      expect(Option.Some(10).unwrapOr(0)).toBe(10);
    });

    test('None 返回默认值', () => {
      expect(Option.None<number>().unwrapOr(0)).toBe(0);
    });
  });
});
