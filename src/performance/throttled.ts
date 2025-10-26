/**
 * 节流包装器
 * @param fn 需要节流的函数
 * @param delay 延迟时间（ms），默认300ms
 */
export function throttled<T extends (...args: any[]) => any>(
  fn: T,
  delay?: number
): (...args: Parameters<T>) => void;

/**
 * 节流包装器（@装饰器调用）
 * @param delay 延迟时间（ms），默认300ms
 */
export function throttled(
  delay?: number
): MethodDecorator;

export function throttled<T extends (...args: any[]) => any>(
  fnOrDelay: T | number,
  delay?: number
): ((...args: Parameters<T>) => void) | MethodDecorator {
  if (typeof fnOrDelay === 'function') {
    const fn = fnOrDelay as T;
    const actualDelay = (delay as number) ?? 300;

    return createThrottledFunction(fn, actualDelay);
  } else {
    const actualDelay = (fnOrDelay as number) ?? 300;

    return function (
      target: any,
      propertyKey: string | symbol,
      descriptor: PropertyDescriptor
    ) {
      if (!descriptor || typeof descriptor.value !== 'function') {
        throw new Error('throttled decorator can only be applied to methods');
      }
      
      const originalMethod = descriptor.value;
      descriptor.value = createThrottledFunction(originalMethod, actualDelay);
      return descriptor;
    };
  }
}

function createThrottledFunction<T extends (...args: any[]) => any>(
  fn: T,
  delay = 300
): (...args: Parameters<T>) => void {
  let lastTime = 0;
  let timer: any = null;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const remaining = delay - (now - lastTime);

    const later = () => {
      lastTime = Date.now();
      timer = null;
      fn.apply(this, args);
    };

    if (remaining <= 0 || remaining > delay) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastTime = now;
      fn.apply(this, args);
    } else {
      clearTimeout(timer);
      timer = setTimeout(later, remaining);
    }
  };
}
