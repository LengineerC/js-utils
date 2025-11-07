type AnyObject = Record<string | symbol, any>;

function isObject(value: any): value is object {
  return value !== null && (typeof value === 'object' || typeof value === 'function');
}

function isArray(value: any): value is any[] {
  return Array.isArray(value);
}

function getTag(value: any): string {
  return Object.prototype.toString.call(value);
}

function initCloneArray(array: any[]): any[] {
  const result = new (array as any).constructor(array.length);
  return result;
}

function initCloneObject(obj: AnyObject): AnyObject {
  return Object.create(Object.getPrototypeOf(obj));
}

function initCloneByTag(value: any, tag: string): any {
  switch (tag) {
    case '[object Date]':
      return new Date(value.getTime());
    case '[object RegExp]': {
      const regex = new RegExp(value.source, value.flags);
      regex.lastIndex = value.lastIndex;
      return regex;
    }
    case '[object Map]':
      return new Map();
    case '[object Set]':
      return new Set();
    case '[object ArrayBuffer]':
      return value.slice(0);
    case '[object Boolean]':
    case '[object Number]':
    case '[object String]':
      return Object(value.valueOf());
    case '[object Uint8Array]':
    case '[object Uint8ClampedArray]':
    case '[object Uint16Array]':
    case '[object Uint32Array]':
    case '[object Int8Array]':
    case '[object Int16Array]':
    case '[object Int32Array]':
    case '[object Float32Array]':
    case '[object Float64Array]':
      return new (value.constructor as any)(value);
    case '[object Error]': {
      const err = new (value as any).constructor(value.message);
      if ('stack' in value) err.stack = value.stack;
      return err;
    }
    case '[object Symbol]':
      // return Object(Symbol.prototype.valueOf.call(value));
      return Symbol(value.description);
    case '[object BigInt]':
      // return Object(BigInt(value.valueOf()));
      return BigInt(value);
    default:
      return null;
  }
}

function baseClone(value: any, stack = new WeakMap()): any {
  if (!isObject(value)) return value;

  if (stack.has(value)) return stack.get(value);

  const tag = getTag(value);
  let result: any;

  if (isArray(value)) {
    result = initCloneArray(value);
    stack.set(value, result);

    for (let i = 0; i < value.length; i++) {
      if (i in value) {
        result[i] = baseClone(value[i], stack);
      }
    }
    return result;
  }

  const clonedByTag = initCloneByTag(value, tag);
  if (clonedByTag !== null) {
    stack.set(value, clonedByTag);

    if (tag === '[object Map]') {
      (value as Map<any, any>).forEach((v: any, k: any) => {
        clonedByTag.set(baseClone(k, stack), baseClone(v, stack));
      });
      return clonedByTag;
    }

    if (tag === '[object Set]') {
      (value as Set<any>).forEach((v: any) => {
        clonedByTag.add(baseClone(v, stack));
      });
      return clonedByTag;
    }

    return clonedByTag;
  }

  if (typeof value === 'function') {
    try {
      return new Function('return ' + value.toString())();
    } catch {
      return value;
    }
  }

  result = initCloneObject(value);
  stack.set(value, result);

  const keys = Reflect.ownKeys(value);
  for (const key of keys) {
    const desc = Object.getOwnPropertyDescriptor(value, key);
    if (desc) {
      const newDesc: PropertyDescriptor = {};

      if (desc.get || desc.set) {
        if (desc.get) newDesc.get = baseClone(desc.get, stack);
        if (desc.set) newDesc.set = baseClone(desc.set, stack);
      } else {
        newDesc.value = baseClone(desc.value, stack);
      }

      newDesc.enumerable = desc.enumerable;
      newDesc.configurable = desc.configurable;
      newDesc.writable = desc.writable;

      Object.defineProperty(result, key, newDesc);
    }
  }

  return result;
}

/**
 * 实现方式来源于lodash, 无法深拷贝函数，返回原函数引用
 * @param {any} value 需要被深拷贝的值
 * @returns 深拷贝后的值
 */
export function cloneDeep<T>(value: T): T {
  return baseClone(value);
}
