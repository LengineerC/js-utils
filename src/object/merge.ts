function isPlainObject(obj: any): obj is Record<string, any> {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function isMergeable(value: any): boolean {
  return (
    value &&
    typeof value === 'object' &&
    !(value instanceof Date) &&
    !(value instanceof RegExp)
  );
}

function cloneValue(value: any): any {
  if (Array.isArray(value)) return value.slice();
  if (value instanceof Map) return new Map(value);
  if (value instanceof Set) return new Set(value);
  if (value instanceof Date) return new Date(value);
  if (isPlainObject(value)) return { ...value };
  return value;
}
/**
 * 深度合并两个对象，并返回合并后的对象
 * @param {any} target 目标对象
 * @param {any} source 源对象
 * @returns {any} 合并后的对象
 */
export function merge<T extends object>(target: T, source: any): T {
  if (target === source) return target;

  if (!isMergeable(target) || !isMergeable(source)) {
    return cloneValue(source);
  }

  // Array
  if (Array.isArray(target) && Array.isArray(source)) {
    return [...target, ...source] as any;
  }

  // Map
  if (target instanceof Map && source instanceof Map) {
    const result = new Map(target);
    for (const [key, value] of source.entries()) {
      if (result.has(key)) {
        result.set(key, merge(result.get(key), value));
      } else {
        result.set(key, cloneValue(value));
      }
    }
    return result as any;
  }

  // Set
  if (target instanceof Set && source instanceof Set) {
    return new Set([...target, ...source]) as any;
  }

  // Date直接覆盖
  if (target instanceof Date && source instanceof Date) {
    return new Date(source) as any;
  }

  // common object
  const result: Record<any, any> = { ...target };
  for (const key of Reflect.ownKeys(source)) {
    const srcVal = (source as any)[key];
    const tgtVal = (target as any)[key];

    if (isMergeable(tgtVal) && isMergeable(srcVal)) {
      result[(key as any)] = merge(tgtVal, srcVal);
    } else {
      result[(key as any)] = cloneValue(srcVal);
    }
  }

  return result;
}
