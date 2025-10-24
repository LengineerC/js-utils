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
      const originalMethod = descriptor.value;
      descriptor.value = createThrottledFunction(originalMethod, actualDelay);
      return descriptor;
    };
  }
}

function createThrottledFunction<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any;

  return function (this: any, ...args: Parameters<T>) {
    lastArgs = args;
    lastThis = this;

    if (!timer) {
      // leading
      fn.apply(this, args);
      timer = setTimeout(() => {
        // trailing
        if (lastArgs) {
          fn.apply(lastThis, lastArgs);
          lastArgs = null;
        }
        timer = null;
      }, delay);
    }
  }
}
