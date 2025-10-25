import {
  genRandomInt,
  genRandomFloat,
  genRandomBoolean,
} from '../../dist';

describe('genRandomInt', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('应该返回在指定区间内的整数', () => {
    const result = genRandomInt(1, 5);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(5);
    expect(Number.isInteger(result)).toBe(true);
  });

  test('min === max 时应返回该值', () => {
    expect(genRandomInt(3, 3)).toBe(3);
  });

  test('应抛出最小值非有限数字错误', () => {
    expect(() => genRandomInt(NaN, 5)).toThrow(/最小值必须是有限数字/);
    expect(() => genRandomInt(Infinity, 5)).toThrow(/最小值必须是有限数字/);
  });

  test('应抛出最大值非有限数字错误', () => {
    expect(() => genRandomInt(0, NaN)).toThrow(/最大值必须是有限数字/);
    expect(() => genRandomInt(0, Infinity)).toThrow(/最大值必须是有限数字/);
  });

  test('应抛出最小值大于最大值错误', () => {
    expect(() => genRandomInt(5, 3)).toThrow(/最小值不能大于最大值/);
  });
});

describe('genRandomFloat', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('应该返回指定区间内的浮点数', () => {
    const result = genRandomFloat(1, 3, 2);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(3);
    expect(result).toBeCloseTo(2.00, 2);
  });

  test('默认参数应生效', () => {
    const result = genRandomFloat();
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(1);
  });

  test('精度为0时应返回整数', () => {
    const result = genRandomFloat(0, 10, 0);
    expect(Number.isInteger(result)).toBe(true);
  });

  test('min === max 时应返回该值', () => {
    expect(genRandomFloat(2, 2, 3)).toBe(2);
  });

  test('应抛出非数字或非有限数错误', () => {
    expect(() => genRandomFloat(NaN, 1)).toThrow(/最小值必须是有限数字/);
    expect(() => genRandomFloat(0, Infinity)).toThrow(/最大值必须是有限数字/);
  });

  test('应抛出最小值大于最大值错误', () => {
    expect(() => genRandomFloat(5, 3)).toThrow(/最小值不能大于最大值/);
  });

  test('应抛出精度类型错误', () => {
    expect(() => genRandomFloat(0, 1, -1)).toThrow(/精度必须是非负整数/);
    expect(() => genRandomFloat(0, 1, 1.2)).toThrow(/精度必须是非负整数/);
  });
});

describe('genRandomBoolean', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.4);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('默认概率为0.5，应有布尔返回值', () => {
    const result = genRandomBoolean();
    expect(typeof result).toBe('boolean');
  });

  test('概率为0时应返回false', () => {
    expect(genRandomBoolean(0)).toBe(false);
  });

  test('概率为1时应返回true', () => {
    expect(genRandomBoolean(1)).toBe(true);
  });

  test('概率中间值应根据Math.random返回结果', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.4);
    expect(genRandomBoolean(0.5)).toBe(true);

    jest.spyOn(global.Math, 'random').mockReturnValue(0.6);
    expect(genRandomBoolean(0.5)).toBe(false);


  });

  test('应抛出概率类型错误', () => {
    expect(() => genRandomBoolean(NaN as any)).toThrow(/概率必须是有限数字/);
    expect(() => genRandomBoolean(Infinity)).toThrow(/概率必须是有限数字/);
  });

  test('应抛出概率范围错误', () => {
    expect(() => genRandomBoolean(-0.1)).toThrow(/概率必须在 0-1 之间/);
    expect(() => genRandomBoolean(1.1)).toThrow(/概率必须在 0-1 之间/);
  });
});