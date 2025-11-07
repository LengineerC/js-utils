import { merge } from '../../src';

describe('merge', () => {
  it('should merge plain objects deeply', () => {
    const a = { user: { name: 'Alex', info: { age: 18 } } };
    const b = { user: { info: { age: 20, city: 'Beijing' } } };

    const result = merge(a, b);
    expect(result).toEqual({
      user: { name: 'Alex', info: { age: 20, city: 'Beijing' } },
    });
  });

  it('should merge arrays by concatenation', () => {
    const a = { list: [1, 2] };
    const b = { list: [3, 4] };

    const result = merge(a, b);
    expect(result.list).toEqual([1, 2, 3, 4]);
  });

  it('should merge Map values by key', () => {
    const a = { map: new Map([['a', 1]]) };
    const b = { map: new Map([['b', 2], ['a', 3]]) };

    const result = merge(a, b);
    expect(result.map.get('a')).toBe(3);
    expect(result.map.get('b')).toBe(2);
  });

  it('should merge Set values as union', () => {
    const a = { set: new Set([1, 2]) };
    const b = { set: new Set([2, 3]) };

    const result = merge(a, b);
    expect(Array.from(result.set).sort()).toEqual([1, 2, 3]);
  });

  it('should clone Date objects', () => {
    const date1 = new Date('2020-01-01');
    const date2 = new Date('2025-01-01');

    const a = { date: date1 };
    const b = { date: date2 };

    const result = merge(a, b);
    expect(result.date.getTime()).toBe(date2.getTime());
    expect(result.date).not.toBe(date2); // 确保是新实例
  });

  it('should merge Symbol properties', () => {
    const sym = Symbol('secret');
    const a = { [sym]: 1 };
    const b = { [sym]: 2 };

    const result = merge(a, b);
    expect(result[sym]).toBe(2);
  });

  it('should not mutate original objects', () => {
    const a = { obj: { x: 1 } };
    const b = { obj: { y: 2 } };

    const result = merge(a, b);
    expect(a).toEqual({ obj: { x: 1 } });
    expect(b).toEqual({ obj: { y: 2 } });
    expect(result).not.toBe(a);
    expect(result).not.toBe(b);
    expect(result).toEqual({ obj: { x: 1, y: 2 } });
  });
});
