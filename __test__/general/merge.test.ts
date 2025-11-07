import { TsMerge as merge } from '../../src';

describe('TsMerge - 合并对象与数组', () => {
  test('应该用 obj2 覆盖基本类型属性', () => {
    const a = { x: 1, y: 2 };
    const b = { x: 10 };
    const res = merge(a, b, 1) as any;

    expect(res.x).toBe(10);
    expect(res.y).toBe(2);
  });

  test('应该拼接数组当 opt=2', () => {
    const a = [1, 2];
    const b = [3, 4];
    const res = merge(a, b, 2) as any;

    expect(Array.isArray(res)).toBe(true);
    expect(res).toEqual([1, 2, 3, 4]);
  });

  test('应该替换数组当 opt=1', () => {
    const a = [1, 2];
    const b = [3, 4];
    const res = merge(a, b, 1) as any;

    expect(Array.isArray(res)).toBe(true);
    expect(res).toEqual([3, 4]);
  });

  test('应该处理对象的循环引用（自引用）', () => {
    const a: any = { val: 1 };
    a.self = a;

    const b: any = { val: 2 };
    b.self = b;

    const res: any = merge(a, b, 1);
    expect(res.val).toBe(2);
    expect(res.self).toBe(res);
  });

  test('应该处理对象相互引用', () => {
    const a: any = { name: 'a' };
    const b: any = { name: 'b' };
    a.other = b;
    b.other = a;

    const res: any = merge(a, b, 1);

    // 合并后应存在相互引用结构
    expect(res.other).toBeDefined();
    expect(res.other.other).toBeDefined();
    // 最终的循环引用应该保持一致（res.other.other === res）
    expect(res.other.other).toBe(res);
  });

  test('应该忽略 undefined 值', () => {
    const a = { x: 1 };
    const b: any = { x: undefined, y: 2 };
    const res: any = merge(a, b, 1);

    expect(res.x).toBe(1);
    expect(res.y).toBe(2);
  });

  test('应该在类型不同时返回 null', () => {
    const a = { a: 1 };
    const b: any = [1, 2, 3];
    const res = merge(a, b, 1);

    expect(res).toBeNull();
  });

  test('应该处理顶层为 undefined 的情况', () => {
    const a: any = undefined;
    const b = { a: 1 };

    const r1: any = merge(a, b, 1);
    const r2: any = merge(b, a, 1);

    expect(r1).toEqual(b);
    expect(r2).toEqual(b);
  });

  test('应该用 obj2 覆盖基本类型（数字）', () => {
    const r = merge(1, 2, 1);
    expect(r).toBe(2);
  });

  test('应该在 seen 中存在 obj2 时直接返回已映射结果', () => {
    const seen = new WeakMap<object, object>();
    const b: any = { a: 1 };
    const mapped = { preset: true } as any;
    seen.set(b, mapped);

    const res: any = merge({}, b, 1, seen as any);
    expect(res).toBe(mapped);
  });

  test('当 opt 非 1/2 时，数组应该默认返回 obj2 的副本', () => {
    const a = [1];
    const b = [2];
    const res: any = merge(a, b, 3 as any);
    expect(res).toEqual([2]);
  });

  test('应该在合并时为 val2 是对象的属性创建占位（触发占位分支）', () => {
    const a: any = {};
    const nested: any = { value: 1 };
    nested.self = nested;
    const b: any = { nested };

    const res: any = merge(a, b, 1);
    expect(res.nested).toBeDefined();
    expect(typeof res.nested).toBe('object');
  });
});
