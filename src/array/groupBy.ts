type PropertyPath = string | number;

/**
 * 支持函数和属性路径两种分组方式
 */
export function groupBy<T, K extends PropertyKey = string>(
  collection: ReadonlyArray<T>,
  iteratee: ((value: T) => K) | PropertyPath,
): Record<K, T[]> {
  if (!Array.isArray(collection) || collection.length === 0) {
    return {} as Record<K, T[]>;
  }

  const result: Record<K, T[]> = {} as Record<K, T[]>;

  const getGroupKey =
    typeof iteratee === 'string' || typeof iteratee === 'number'
      ? createPathAccessor(iteratee)
      : iteratee;

  for (const item of collection) {
    const key = getGroupKey(item) as K;
    if (key === undefined || key === null) continue;
    if (!Object.prototype.hasOwnProperty.call(result, key)) {
      result[key] = [];
    }

    result[key].push(item);
  }

  return result;
}

// 路径访问器
function createPathAccessor(path: string | number) {
  return (obj: any): any => {
    // 数字路径直接作为索引访问
    if (typeof path === 'number') {
      return obj?.[path];
    }
    // 字符串路径按点分割访问，可深层级访问
    return path
      .split('.')
      .reduce((current, key) => (current == null ? undefined : current[key as any]), obj);
  };
}
