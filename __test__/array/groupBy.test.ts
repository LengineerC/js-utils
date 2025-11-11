import { groupBy } from '../../src';

describe('groupBy', () => {
  test('应该在 iteratee 为函数且 collection 为正常数组时正确分组', () => {
    const arr = [1, 2, 3, 4, 5, 6];
    const res = groupBy(arr, (n) => n % 2);

    expect(Object.keys(res).length).toBe(2);
    expect(res[0]).toEqual([2, 4, 6]);
    expect(res[1]).toEqual([1, 3, 5]);
  });

  test('应该在 iteratee 为函数但 collection 为不正常值时返回空对象', () => {
    // undefined
    const r1 = groupBy(undefined as any, (x: any) => x);
    expect(r1).toEqual({});

    // 空数组
    const r2 = groupBy([], (x: any) => x);
    expect(r2).toEqual({});
  });

  test('应该在 iteratee 为数字时按索引分组', () => {
    const arr = [['a', 1], ['b', 2], ['a', 3]];
    const res = groupBy(arr, 0);

    expect(res['a']).toHaveLength(2);
    expect(res['a']).toEqual([['a', 1], ['a', 3]]);
    expect(res['b']).toEqual([['b', 2]]);
  });

  test('应该在 iteratee 为字符串且无嵌套时按属性分组', () => {
    const arr = [{ type: 'x', v: 1 }, { type: 'y', v: 2 }, { type: 'x', v: 3 }];
    const res = groupBy(arr, 'type');

    expect(res.x).toEqual([{ type: 'x', v: 1 }, { type: 'x', v: 3 }]);
    expect(res.y).toEqual([{ type: 'y', v: 2 }]);
  });

  test('应该在 iteratee 为字符串且为嵌套路径时按深层属性分组', () => {
    const arr = [
      { info: { kind: 'a' }, v: 1 },
      { info: { kind: 'b' }, v: 2 },
      { info: { kind: 'a' }, v: 3 },
    ];

    const res = groupBy(arr, 'info.kind');

    expect(res.a).toEqual([arr[0], arr[2]]);
    expect(res.b).toEqual([arr[1]]);
  });

  test('应该在 iteratee 为字符串且元素包含循环引用时正常分组并保留引用', () => {
    const a: any = { info: { kind: 'c' }, v: 1 };
    a.self = a; // 循环引用

    const b: any = { info: { kind: 'd' }, v: 2 };
    b.self = b; // 循环引用

    const res = groupBy([a, b], 'info.kind');

    expect(res.c).toBeDefined();
    expect(res.d).toBeDefined();
    expect(res.c[0]).toBe(a);
    expect(res.d[0]).toBe(b);
    // 循环引用保留
    expect(res.c[0].self).toBe(a);
    expect(res.d[0].self).toBe(b);
  });

  test('应该跳过 age 为 null/undefined 或缺失的项，只分组有值的项', () => {
    const arr: any[] = [
      { name: 'a', age: null },
      { name: 'b', age: undefined },
      { name: 'c' },
      { name: 'd', age: 20 },
      { name: 'e', age: 20 },
    ];

    const res = groupBy(arr, 'age');

    // 只有 age=20 的两项会被分组，其他被跳过
    expect(Object.keys(res)).toHaveLength(1);
    expect(res['20']).toEqual([{ name: 'd', age: 20 }, { name: 'e', age: 20 }]);
  });

  test('应该在访问不存在的嵌套路径时跳过无值项并只分组存在路径值的元素', () => {
    const arr = [
      { a: { x: 'g1' }, v: 1 },
      { a: { y: 'g2' }, v: 2 },
      { b: 3 },
    ];

    const res = groupBy(arr, 'a.x');

    expect(res.g1).toEqual([arr[0]]);
    expect(res.g2).toBeUndefined();
    expect(Object.keys(res)).toHaveLength(1);
  });
});
