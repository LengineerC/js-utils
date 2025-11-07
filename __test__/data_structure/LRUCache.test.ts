import { LRUCache } from '../../src';

describe('LRUCache', () => {
  let cache: LRUCache<string, number>;

  beforeEach(() => {
    cache = new LRUCache<string, number>(3);
  });

  test('set and get values', () => {
    cache.set('a', 1);
    cache.set('b', 2);

    expect(cache.get('a')).toBe(1);
    expect(cache.get('b')).toBe(2);
    expect(cache.get('c')).toBeUndefined();
  });

  test('has method', () => {
    cache.set('x', 10);
    expect(cache.has('x')).toBe(true);
    expect(cache.has('y')).toBe(false);
  });

  test('delete method', () => {
    cache.set('a', 1);
    cache.set('b', 2);

    expect(cache.delete('a')).toBe(true);
    expect(cache.has('a')).toBe(false);
    expect(cache.delete('a')).toBe(false); // 删除不存在的 key
  });

  test('capacity limit and LRU eviction', () => {
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);

    expect(cache.has('a')).toBe(true);
    expect(cache.has('b')).toBe(true);
    expect(cache.has('c')).toBe(true);

    // 访问 a，提升它的优先级
    cache.get('a');

    // 插入新元素 d，最久未使用的 b 应该被淘汰
    cache.set('d', 4);

    expect(cache.has('a')).toBe(true); // a 被访问过，保留
    expect(cache.has('b')).toBe(false); // b 被淘汰
    expect(cache.has('c')).toBe(true);
    expect(cache.has('d')).toBe(true);
  });

  test('update value moves key to head', () => {
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);

    // 更新 b 的值
    cache.set('b', 20);

    // 插入新元素 d，a 应该被淘汰，因为 b 刚被访问/更新
    cache.set('d', 4);

    expect(cache.has('a')).toBe(false);
    expect(cache.has('b')).toBe(true);
    expect(cache.get('b')).toBe(20);
  });

  test('throw error if capacity <= 0', () => {
    expect(() => new LRUCache(0)).toThrow('LRUCache capacity must be greater than 0');
    expect(() => new LRUCache(-1)).toThrow('LRUCache capacity must be greater than 0');
  });

  test('handles deleting tail correctly', () => {
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    cache.get('a'); // 访问 a, tail 应该是 b

    cache.set('d', 4); // 淘汰 b

    expect(cache.has('b')).toBe(false);
    expect(cache.has('c')).toBe(true);
    expect(cache.has('a')).toBe(true);
    expect(cache.has('d')).toBe(true);
  });
});
