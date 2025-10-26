/**
 * 防抖包装器
 * @param fn 需要防抖的函数
 * @param delay 延迟时间（ms），默认300ms
 * @param immediate 是否立即执行
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay?: number,
  immediate?: boolean
): (...args: Parameters<T>) => void;

/**
 * 防抖包装器
 * @param delay 延迟时间（ms），默认300ms
 * @param immediate 是否立即执行
 */
export function debounce(
  delay?: number,
  immediate?: boolean
): MethodDecorator;

export function debounce<T extends (...args: any[]) => any>(
  fnOrDelay: T | number,
  delayOrImmediate?: number | boolean,
  immediate?: boolean
): ((...args: Parameters<T>) => void) | MethodDecorator {
  if (typeof fnOrDelay === 'function') {
    const fn = fnOrDelay as T;
    const delay = (delayOrImmediate as number) ?? 300;
    const imm = immediate as boolean ?? false;
    
    return createDebouncedFunction(fn, delay, imm);
  } else {
    const delay = (fnOrDelay as number) ?? 300;
    const imm = (delayOrImmediate as boolean) ?? false;
    
    return function (
      target: any,
      propertyKey: string | symbol,
      descriptor: PropertyDescriptor
    ) {
      if (!descriptor || typeof descriptor.value !== 'function') {
        throw new Error('debounce decorator can only be applied to methods');
      }
      
      const originalMethod = descriptor.value;
      descriptor.value = createDebouncedFunction(originalMethod, delay, imm);
      return descriptor;
    };
  }
}

function createDebouncedFunction<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  immediate: boolean
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
