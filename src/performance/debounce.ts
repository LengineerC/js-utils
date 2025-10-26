/**
 * 防抖函数
 * @param fn 需要防抖的函数
 * @param delay 延迟时间（ms），默认300ms
 * @param immediate 是否立即执行
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let isImmediateCalled = false;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    if (timer) clearTimeout(timer);

    if (immediate && !isImmediateCalled) {
      fn.apply(context, args);
      isImmediateCalled = true;
    }

    timer = setTimeout(() => {
      if (!immediate) {
        fn.apply(context, args);
      }
      isImmediateCalled = false;
    }, delay);
  };
}

/**
 * 防抖函数装饰器（用于方法，通过@装饰器语法调用）
 * @param delay 延迟时间（ms），默认300ms
 * @param immediate 是否立即执行
 */
export function debounced(delay: number = 300, immediate: boolean = false): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    if (!descriptor || typeof descriptor.value !== 'function') {
      throw new Error('debounced decorator can only be applied to methods');
    }

    const originalMethod = descriptor.value;
    descriptor.value = debounce(originalMethod, delay, immediate);
    return descriptor;
  };
}
