/**
 * 节流函数
 * @param {(...args: any[]) => any} fn 需要节流的函数
 * @param {number} delay 延迟时间（ms），默认300ms
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300,
): (...args: Parameters<T>) => void {
  let lastTime = 0;
  let timer: any = null;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const remaining = delay - (now - lastTime);

    if (remaining <= 0 || remaining > delay) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastTime = now;
      fn.apply(this, args);
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        lastTime = Date.now();
        timer = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}

/**
 * 节流装饰器（用于方法，通过@装饰器语法调用）
 * @param {number} delay 延迟时间（ms），默认300ms
 */
export function throttled(delay: number = 300): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    if (!descriptor || typeof descriptor.value !== 'function') {
      throw new Error('throttled decorator can only be applied to methods');
    }

    const originalMethod = descriptor.value;
    descriptor.value = throttle(originalMethod, delay);
    return descriptor;
  };
}
