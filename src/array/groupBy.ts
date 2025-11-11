type PropertyPath = string | number;

/**
 * 根据集合中的值对集合进行分组。
 * @template T 集合元素的类型。
 * @template K 最终分组键的类型（必须是 PropertyKey 的子类型）。
 * @param {ReadonlyArray<T>} collection 要分组的集合。
 * @param {((value: T) => K) | PropertyPath} iteratee 用于生成分组键的函数或属性路径。
 * @returns {Record<K, T[]>} 以分组键为键，以包含该键下所有元素的数组为值的对象。
 */
export function groupBy<T, K extends PropertyKey>(
  collection: ReadonlyArray<T>,
  iteratee: ((value: T) => K) | PropertyPath,
): Record<K, T[]> {
  if (!Array.isArray(collection) || collection.length === 0) {
    return {} as Record<K, T[]>;
  }

  const getGroupKey =
    typeof iteratee === 'string' || typeof iteratee === 'number'
      ? createPathAccessor(iteratee)
      : iteratee;

  const result: Record<K, T[]> = {} as Record<K, T[]>;
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
  const isNumericKey = typeof path === 'number' || /^\d+$/.test(path);

  return (obj: any): any => {
    // 数字路径直接作为索引访问
    if (isNumericKey) return obj?.[Number(path)];

    // 字符串路径按点分割访问，可深层级访问
    return path
      .split('.')
      .reduce((current, key) => (current == null ? undefined : current[key as any]), obj);
  };
}
