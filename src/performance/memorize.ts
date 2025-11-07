/**
 * 缓存函数
 * @param {(...args: any[]) => any} fn 需要被缓存的函数
 * @returns 缓存后的函数
 */
export function memorize<T extends (...args: any[]) => any>(fn: T): T {
  const cacheRoot = new Map<any, any>();
  const __value__ = Symbol('__value__');

  function getCacheNode(args: any[]): { has: boolean; value: any } | undefined {
    let current = cacheRoot;
    for (const arg of args) {
      const next = current.get(arg);
      if (next === undefined) return { has: false, value: current };
      current = next;
    }

    if (current.has(__value__)) {
      return { has: true, value: current.get(__value__) };
    }
    return { has: false, value: current };
  }

  function setCacheNode(args: any[], value: any) {
    let current = cacheRoot;
    for (const arg of args) {
      let next = current.get(arg);
      if (!next) {
        next = new Map();
        current.set(arg, next);
      }
      current = next;
    }
    current.set(__value__, value);
  }

  return function (this: any, ...args: Parameters<T>): ReturnType<T> {
    const cached = getCacheNode(args);
    if (cached?.has) {
      return cached.value;
    }
    const result = fn.apply(this, args);
    setCacheNode(args, result);
    return result;
  } as T;
}

/**
 * 函数缓存装饰器（通过@装饰器语法调用）
 */
export function memorized(
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): void {
  if (!descriptor || typeof descriptor.value !== 'function') {
    throw new Error('memorized decorator can only be applied to methods');
  }

  const originalMethod = descriptor.value;
  descriptor.value = memorize(originalMethod);
}
