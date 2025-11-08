/* eslint-disable */

// const COMPARE_PARTIAL_FLAG = 1;

// const argsTag = '[object Arguments]';
// const arrayTag = '[object Array]';
// const boolTag = '[object Boolean]';
// const dateTag = '[object Date]';
// const errorTag = '[object Error]';
// const mapTag = '[object Map]';
// const numberTag = '[object Number]';
// const objectTag = '[object Object]';
// const regexpTag = '[object RegExp]';
// const setTag = '[object Set]';
// const stringTag = '[object String]';
// const symbolTag = '[object Symbol]';
// const arrayBufferTag = '[object ArrayBuffer]';
// const dataViewTag = '[object DataView]';

// const typedArrayTags = new Set([
//   '[object Int8Array]', '[object Uint8Array]', '[object Uint8ClampedArray]',
//   '[object Int16Array]', '[object Uint16Array]', '[object Int32Array]',
//   '[object Uint32Array]', '[object Float32Array]', '[object Float64Array]',
//   '[object BigInt64Array]', '[object BigUint64Array]',
// ]);

// const hasOwnProperty = Object.prototype.hasOwnProperty;
// const symToStringTag = typeof Symbol !== 'undefined' ? Symbol.toStringTag : undefined;

// class Stack {
//   private data = new Map<any, any>();

//   constructor(entries?: [any, any][] | null) {
//     if (entries) {
//       entries.forEach(([k, v]) => this.data.set(k, v));
//     }
//   }

//   set(key: any, value: any) { this.data.set(key, value); return this; }
//   get(key: any) { return this.data.get(key); }
//   has(key: any) { return this.data.has(key); }
//   delete(key: any) { return this.data.delete(key); }
//   clear() { this.data.clear(); }
// }

// function isObjectLike(value: any): value is object {
//   return value !== null && typeof value === 'object';
// }

// function getTag(value: any): string {
//   if (value == null) return value === undefined ? '[object Undefined]' : '[object Null]';
//   return Object.prototype.toString.call(value);
// }

// function isTypedArray(value: any) {
//   return isObjectLike(value) && typedArrayTags.has(getTag(value));
// }

// function isBuffer(value: any) {
//   return value != null && typeof value.constructor?.isBuffer === 'function' && value.constructor.isBuffer(value);
// }

// function setToArray(set: Set<any>) {
//   return Array.from(set);
// }

// function mapToArray(map: Map<any, any>) {
//   return Array.from(map.entries());
// }

// function getAllKeys(obj: any): (string | symbol)[] {
//   let keys: (string | symbol)[] = Object.getOwnPropertyNames(obj);
//   if (typeof Object.getOwnPropertySymbols === 'function') {
//     keys.push(...Object.getOwnPropertySymbols(obj));
//   }
//   return keys;
// }

// function equalArrays(array: any[], other: any[], bitmask: number, customizer: any, equalFunc: any, stack: Stack): boolean {
//   const isPartial = bitmask & COMPARE_PARTIAL_FLAG;
//   if (array.length !== other.length && !(isPartial && other.length >= array.length)) return false;

//   const stacked = stack.get(array);
//   if (stacked) return stacked === other;
//   stack.set(array, other);
//   stack.set(other, array);

//   for (let i = 0; i < array.length; i++) {
//     const arrVal = array[i];
//     const othVal = other[i];
//     let comp;
//     if (customizer) {
//       comp = isPartial ? customizer(othVal, arrVal, i, other, array, stack) : customizer(arrVal, othVal, i, array, other, stack);
//     }
//     if (comp === undefined ? !equalFunc(arrVal, othVal, bitmask, customizer, stack) : !comp) {
//       stack.delete(array); stack.delete(other);
//       return false;
//     }
//   }

//   stack.delete(array); stack.delete(other);
//   return true;
// }

// function equalByView(a: ArrayBuffer | DataView, b: ArrayBuffer | DataView): boolean {
//   const viewA = new DataView(a instanceof DataView ? a.buffer : a);
//   const viewB = new DataView(b instanceof DataView ? b.buffer : b);
//   if (viewA.byteLength !== viewB.byteLength) return false;
//   for (let i = 0; i < viewA.byteLength; i++) {
//     if (viewA.getUint8(i) !== viewB.getUint8(i)) return false;
//   }
//   return true;
// }

// function equalMaps(map: Map<any, any>, other: Map<any, any>, bitmask: number, customizer: any, equalFunc: any, stack: Stack): boolean {
//   const isPartial = bitmask & COMPARE_PARTIAL_FLAG;
//   if (map.size !== other.size && !isPartial) return false;

//   const stacked = stack.get(map);
//   if (stacked) return stacked === other;
//   stack.set(map, other); stack.set(other, map);

//   for (const [key, val] of map) {
//     if (!other.has(key)) return false;
//     const othVal = other.get(key);
//     let comp = customizer?.(val, othVal, key, map, other, stack);
//     if (comp === undefined ? !equalFunc(val, othVal, bitmask, customizer, stack) : !comp) return false;
//   }

//   stack.delete(map); stack.delete(other);
//   return true;
// }

// function equalSets(set: Set<any>, other: Set<any>, bitmask: number, customizer: any, equalFunc: any, stack: Stack): boolean {
//   const isPartial = bitmask & COMPARE_PARTIAL_FLAG;
//   if (set.size !== other.size && !isPartial) return false;

//   const stacked = stack.get(set);
//   if (stacked) return stacked === other;
//   stack.set(set, other); stack.set(other, set);

//   const otherValues = Array.from(other);
//   for (const val of set) {
//     let found = false;
//     for (let i = 0; i < otherValues.length; i++) {
//       const othVal = otherValues[i];
//       let comp = customizer?.(val, othVal, undefined, set, other, stack);
//       if (comp === undefined ? equalFunc(val, othVal, bitmask, customizer, stack) : comp) {
//         found = true;
//         otherValues.splice(i, 1);
//         break;
//       }
//     }
//     if (!found) return false;
//   }

//   stack.delete(set); stack.delete(other);
//   return true;
// }

// function equalByTag(object: any, other: any, tag: string, bitmask: number, customizer: any, equalFunc: any, stack: Stack): boolean {
//   switch (tag) {
//     case dataViewTag: case arrayBufferTag: return equalByView(object, other);
//     case boolTag: case dateTag: case numberTag: return Object.is(object, other);
//     case errorTag: return object.name === other.name && object.message === other.message;
//     case regexpTag: case stringTag: return object.toString() === other.toString();
//     case mapTag: return equalMaps(object, other, bitmask, customizer, equalFunc, stack);
//     case setTag: return equalSets(object, other, bitmask, customizer, equalFunc, stack);
//     case symbolTag: return Object.is(object.valueOf(), other.valueOf());
//   }
//   return false;
// }

// function equalObjects(object: any, other: any, bitmask: number, customizer: any, equalFunc: any, stack: Stack): boolean {
//   const isPartial = bitmask & COMPARE_PARTIAL_FLAG;
//   const objProto = Object.getPrototypeOf(object);
//   const othProto = Object.getPrototypeOf(other);
//   if (objProto !== othProto) return false;

//   if (getTag(object) === argsTag && getTag(other) === argsTag) {
//     return equalArrays(Array.from(object), Array.from(other), bitmask, customizer, equalFunc, stack);
//   }

//   const stacked = stack.get(object);
//   if (stacked) return stacked === other;
//   stack.set(object, other); stack.set(other, object);

//   const keys = getAllKeys(object);
//   const othKeys = getAllKeys(other);

//   if (!isPartial && keys.length !== othKeys.length) return false;

//   for (const key of keys) {
//     if (isPartial && !hasOwnProperty.call(other, key)) continue;

//     let objVal, othVal;
//     try {
//       objVal = object[key];
//       othVal = other[key];
//     } catch {
//       return false; // 保护 Arguments 或 getter 报错
//     }

//     let comp = customizer?.(objVal, othVal, key, object, other, stack);
//     if (comp === undefined ? !equalFunc(objVal, othVal, bitmask, customizer, stack) : !comp) return false;
//   }

//   // 检查多余 key
//   if (!isPartial) {
//     const otherKeySet = new Set(othKeys);
//     for (const key of keys) otherKeySet.delete(key);
//     if (otherKeySet.size > 0) return false;
//   }

//   stack.delete(object); stack.delete(other);
//   return true;
// }

// function baseIsEqualDeep(object: any, other: any, bitmask: number, customizer: any, equalFunc: any, stack: Stack): boolean {
//   const objIsArr = Array.isArray(object);
//   const othIsArr = Array.isArray(other);
//   let objTag = objIsArr ? arrayTag : getTag(object);
//   let othTag = othIsArr ? arrayTag : getTag(other);

//   objTag = objTag === argsTag ? objectTag : objTag;
//   othTag = othTag === argsTag ? objectTag : othTag;

//   const objIsObj = objTag === objectTag;
//   const isSameTag = objTag === othTag;

//   if (isSameTag && isBuffer(object)) return isBuffer(other) && equalArrays(object, other, bitmask, customizer, equalFunc, stack);
//   if (isSameTag && !objIsObj) return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);

//   if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
//     const objIsWrapped = isObjectLike(object) && '__wrapped__' in object;
//     const othIsWrapped = isObjectLike(other) && '__wrapped__' in other;
//     if (objIsWrapped || othIsWrapped) {
//       return equalFunc(objIsWrapped ? (object as any).value() : object, othIsWrapped ? (other as any).value() : other, bitmask, customizer, stack);
//     }
//   }

//   if (!isSameTag) return false;
//   return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
// }

// function baseIsEqual(value: any, other: any, bitmask?: number, customizer?: any, stack?: Stack): boolean {
//   if (value === other) return value !== 0 || 1 / value === 1 / other; // 处理 0/-0
//   if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) return value !== value && other !== other; // NaN
//   return baseIsEqualDeep(value, other, bitmask || 0, customizer, baseIsEqual, stack || new Stack());
// }

// /**
//  * 执行两个值之间的深度比较，以确定它们是否相等。
//  * @param {any} value 要比较的值。
//  * @param {any} other 要比较的另一个值。
//  * @returns {boolean} 如果值相等，则返回 `true`，否则返回 `false`。
//  */
// export function isEqual(value: any, other: any): boolean {
//   return baseIsEqual(value, other);
// }

////////////////////////  Lodash改TS  /////////////////////////////

const symbolProto = Symbol ? Symbol.prototype : undefined,
  symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
  symbolToString = symbolProto ? symbolProto.toString : undefined;

const nativeGetSymbols = Object.getOwnPropertySymbols,
  nativeKeys = overArg(Object.keys, Object);
const propertyIsEnumerable = Object.prototype.propertyIsEnumerable;

const freeGlobal: any = typeof global == 'object' && global && global.Object === Object && global;
const freeExports: any = typeof exports == 'object' && exports && !exports.nodeType && exports;
const freeModule: any =
  freeExports && typeof module == 'object' && module && !(module as any).nodeType && module;
const moduleExports: any = freeModule && freeModule.exports === freeExports;
const freeProcess: any = moduleExports && freeGlobal.process;

const MAX_SAFE_INTEGER = 9007199254740991;
const COMPARE_PARTIAL_FLAG = 1,
  COMPARE_UNORDERED_FLAG = 2;

const reIsUint = /^(?:0|[1-9]\d*)$/;

const argsTag = '[object Arguments]',
  arrayTag = '[object Array]',
  asyncTag = '[object AsyncFunction]',
  boolTag = '[object Boolean]',
  dateTag = '[object Date]',
  domExcTag = '[object DOMException]',
  errorTag = '[object Error]',
  funcTag = '[object Function]',
  genTag = '[object GeneratorFunction]',
  mapTag = '[object Map]',
  numberTag = '[object Number]',
  nullTag = '[object Null]',
  objectTag = '[object Object]',
  promiseTag = '[object Promise]',
  proxyTag = '[object Proxy]',
  regexpTag = '[object RegExp]',
  setTag = '[object Set]',
  stringTag = '[object String]',
  symbolTag = '[object Symbol]',
  undefinedTag = '[object Undefined]',
  weakMapTag = '[object WeakMap]',
  weakSetTag = '[object WeakSet]';

const arrayBufferTag = '[object ArrayBuffer]',
  dataViewTag = '[object DataView]',
  float32Tag = '[object Float32Array]',
  float64Tag = '[object Float64Array]',
  int8Tag = '[object Int8Array]',
  int16Tag = '[object Int16Array]',
  int32Tag = '[object Int32Array]',
  uint8Tag = '[object Uint8Array]',
  uint8ClampedTag = '[object Uint8ClampedArray]',
  uint16Tag = '[object Uint16Array]',
  uint32Tag = '[object Uint32Array]';

const typedArrayTags: Record<string, boolean> = {};
typedArrayTags[float32Tag] =
  typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] =
  typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] =
  typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] =
  typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] =
    true;
typedArrayTags[argsTag] =
  typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] =
  typedArrayTags[boolTag] =
  typedArrayTags[dataViewTag] =
  typedArrayTags[dateTag] =
  typedArrayTags[errorTag] =
  typedArrayTags[funcTag] =
  typedArrayTags[mapTag] =
  typedArrayTags[numberTag] =
  typedArrayTags[objectTag] =
  typedArrayTags[regexpTag] =
  typedArrayTags[setTag] =
  typedArrayTags[stringTag] =
  typedArrayTags[weakMapTag] =
    false;

function baseUnary(func: Function) {
  return function (value: any) {
    return func(value);
  };
}

function mapToArray(map: Map<any, any>) {
  let index = -1,
    result = Array(map.size);

  map.forEach((value, key) => {
    result[++index] = [key, value];
  });
  return result;
}

function setToArray(set: Set<any>) {
  let index = -1,
    result = Array(set.size);

  set.forEach(function (value) {
    result[++index] = value;
  });
  return result;
}

class MapCache<K = any, V = any> {
  private data: Map<K, V>;

  constructor(entries?: [K, V][]) {
    this.data = new Map(entries);
  }

  set(key: K, value: V) {
    this.data.set(key, value);
    return this;
  }

  get(key: K) {
    return this.data.get(key);
  }

  has(key: K) {
    return this.data.has(key);
  }

  delete(key: K) {
    return this.data.delete(key);
  }

  clear() {
    this.data.clear();
  }
}

class SetCache<T = any> {
  private __data__: MapCache<T, boolean>;

  constructor(values?: T[]) {
    this.__data__ = new MapCache();
    values?.forEach(v => this.push(v));
  }

  push(value: T) {
    this.__data__.set(value, true);
    return this;
  }

  has(value: T) {
    return this.__data__.has(value);
  }
}

class ListCache {
  private __data__: Array<[any, any]> = [];
  public size: number = 0;

  constructor(entries?: [any, any][] | null) {
    let index = -1;
    const length = entries == null ? 0 : entries.length;

    this.clear();

    if (entries) {
      while (++index < length) {
        const entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
  }

  clear(): void {
    this.__data__ = [];
    this.size = 0;
  }

  set(key: any, value: any): this {
    const data = this.__data__;
    const index = data.findIndex(([k]) => k === key);

    if (index < 0) {
      this.size++;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }

    return this;
  }

  get(key: any): any {
    const entry = this.__data__.find(([k]) => k === key);
    return entry ? entry[1] : undefined;
  }

  has(key: any): boolean {
    return this.__data__.some(([k]) => k === key);
  }

  delete(key: any): boolean {
    const index = this.__data__.findIndex(([k]) => k === key);
    if (index < 0) {
      return false;
    }

    this.__data__.splice(index, 1);
    this.size--;
    return true;
  }
}

class Stack {
  public __data__: ListCache;
  public size: number;

  constructor(entries?: [any, any][] | null) {
    const data = (this.__data__ = new ListCache(entries));
    this.size = data.size;
  }

  get(key: any): any {
    return this.__data__.get(key);
  }

  set(key: any, value: any): this {
    this.__data__.set(key, value);
    this.size = this.__data__.size;
    return this;
  }

  has(key: any): boolean {
    return this.__data__.has(key);
  }

  delete(key: any): boolean {
    const result = this.__data__.delete(key);
    this.size = this.__data__.size;
    return result;
  }

  // 清空 Stack
  clear(): void {
    this.__data__.clear();
    this.size = 0;
  }
}

const nodeUtil = (function () {
  try {
    // Use `util.types` for Node.js 10+.
    let types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
})();

function isLength(value: any) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

function baseIsTypedArray(value: any) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

function eq(value: any, other: any) {
  return value === other || (value !== value && other !== other);
}

function overArg(func: Function, transform: Function) {
  return function (arg: any) {
    return func(transform(arg));
  };
}

const nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer,
  nodeIsDate = nodeUtil && nodeUtil.isDate,
  nodeIsMap = nodeUtil && nodeUtil.isMap,
  nodeIsRegExp = nodeUtil && nodeUtil.isRegExp,
  nodeIsSet = nodeUtil && nodeUtil.isSet,
  nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

const nativeIsBuffer = (() => {
  try {
    const B = globalThis.Buffer;
    return typeof B === 'function' && typeof B.isBuffer === 'function' ? B.isBuffer : () => false;
  } catch {
    return () => false;
  }
})();
const symToStringTag = Symbol ? Symbol.toStringTag : undefined;
const isBuffer: any = nativeIsBuffer || false;
const isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

function isObject(value: any) {
  let type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

function isFunction(value: any) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  let tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

function isObjectLike(value: any) {
  return value != null && typeof value == 'object';
}

function isArrayLike(value: any) {
  return value != null && isLength(value.length) && !isFunction(value);
}

function baseIsArguments(value: any) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

const isArguments = baseIsArguments(
  (function () {
    return arguments;
  })(),
)
  ? baseIsArguments
  : function (value: any) {
      return (
        isObjectLike(value) &&
        Object.hasOwnProperty.call(value, 'callee') &&
        !propertyIsEnumerable.call(value, 'callee')
      );
    };

function getRawTag(value: any) {
  if (!symToStringTag) {
    return Object.prototype.toString.call(value);
  }

  let isOwn = Object.hasOwnProperty.call(value, symToStringTag),
    tag = value[symToStringTag];
  const unmasked = true;

  try {
    value[symToStringTag] = undefined;
  } catch (e) {}

  let result = Object.prototype.toString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

function baseTimes(n: number, iteratee: Function) {
  let index = -1,
    result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

function isIndex(value: any, length: number) {
  let type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return (
    !!length &&
    (type == 'number' || (type != 'symbol' && reIsUint.test(value))) &&
    value > -1 &&
    value % 1 == 0 &&
    value < length
  );
}

function isPrototype(value: any) {
  let Ctor = value && value.constructor,
    proto = (typeof Ctor == 'function' && Ctor.prototype) || Object.prototype;

  return value === proto;
}

function arrayLikeKeys(value: any, inherited?: boolean) {
  let isArr = Array.isArray(value),
    isArg = !isArr && isArguments(value),
    isBuff = !isArr && !isArg && isBuffer(value),
    isType = !isArr && !isArg && !isBuff && isTypedArray(value),
    skipIndexes = isArr || isArg || isBuff || isType,
    result = skipIndexes ? baseTimes(value.length, String) : [],
    length = result.length;

  for (let key in value) {
    if (
      (inherited || Object.hasOwnProperty.call(value, key)) &&
      !(
        skipIndexes &&
        // Safari 9 has enumerable `arguments.length` in strict mode.
        (key == 'length' ||
          // Node.js 0.10 has enumerable non-index properties on buffers.
          (isBuff && (key == 'offset' || key == 'parent')) ||
          // PhantomJS 2 has enumerable non-index properties on typed arrays.
          (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
          // Skip index properties.
          isIndex(key, length))
      )
    ) {
      result.push(key);
    }
  }
  return result;
}

function objectToString(value: any) {
  return Object.prototype.toString.call(value);
}

function baseGetTag(value: any) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value)
    ? getRawTag(value)
    : objectToString(value);
}

function baseGetAllKeys(object: any, keysFunc: Function, symbolsFunc: Function) {
  const result: any[] = keysFunc(object);
  const symbols = symbolsFunc(object);
  return result.concat(symbols);
}

function baseKeys(object: object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  let result = [];
  for (let key in Object(object)) {
    if (Object.hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

function keys(object: any) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

const getSymbols: any = !nativeGetSymbols
  ? []
  : function (object: any) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return nativeGetSymbols(object).filter(symbol => {
        return propertyIsEnumerable.call(object, symbol);
      });
    };

function getAllKeys(object: any) {
  return baseGetAllKeys(object, keys, getSymbols);
}

const getTag = baseGetTag;

function equalArrays(
  array: any[],
  other: any[],
  bitmask: number,
  customizer: any,
  equalFunc: any,
  stack: Stack,
) {
  let isPartial = bitmask & COMPARE_PARTIAL_FLAG,
    arrLength = array.length,
    othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Check that cyclic values are equal.
  let arrStacked = stack.get(array);
  let othStacked = stack.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }
  let index = -1,
    result = true,
    seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    let arrValue = array[index],
      othValue = other[index];

    let compared;
    if (customizer) {
      compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (
        !other.some((othValue, othIndex) => {
          if (
            !seen.has(othIndex) &&
            (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))
          ) {
            return seen.push(othIndex);
          }
        })
      ) {
        result = false;
        break;
      }
    } else if (
      !(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))
    ) {
      result = false;
      break;
    }
  }
  stack.delete(array);
  stack.delete(other);
  return result;
}

function equalByTag(
  object: any,
  other: any,
  tag: string,
  bitmask: number,
  customizer: any,
  equalFunc: any,
  stack: Stack,
) {
  let convert: any;

  switch (tag) {
    case dataViewTag:
      if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if (
        object.byteLength != other.byteLength ||
        !equalFunc(new Uint8Array(object), new Uint8Array(other))
      ) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == other + '';

    case mapTag:
      convert = mapToArray;

    case setTag:
      let isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      let stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      let result = equalArrays(
        convert(object),
        convert(other),
        bitmask,
        customizer,
        equalFunc,
        stack,
      );
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

function equalObjects(
  object: any,
  other: any,
  bitmask: number,
  customizer: any,
  equalFunc: any,
  stack: Stack,
) {
  let isPartial = bitmask & COMPARE_PARTIAL_FLAG,
    objProps = getAllKeys(object),
    objLength = objProps.length,
    othProps = getAllKeys(other),
    othLength = othProps.length;

  let key: any;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  let index = objLength;
  while (index--) {
    key = objProps[index];
    if (!(isPartial ? key in other : Object.hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Check that cyclic values are equal.
  let objStacked = stack.get(object);
  let othStacked = stack.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }
  let result = true;
  stack.set(object, other);
  stack.set(other, object);

  let skipCtor: any = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    let objValue = object[key],
      othValue = other[key];

    let compared: any;
    if (customizer) {
      compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (
      !(compared === undefined
        ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack)
        : compared)
    ) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    let objCtor = object.constructor,
      othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (
      objCtor != othCtor &&
      'constructor' in object &&
      'constructor' in other &&
      !(
        typeof objCtor == 'function' &&
        objCtor instanceof objCtor &&
        typeof othCtor == 'function' &&
        othCtor instanceof othCtor
      )
    ) {
      result = false;
    }
  }
  stack.delete(object);
  stack.delete(other);
  return result;
}

function baseIsEqualDeep(
  object: any,
  other: any,
  bitmask: number,
  customizer: any,
  equalFunc: any,
  stack: Stack,
) {
  let objIsArr = Array.isArray(object),
    othIsArr = Array.isArray(other),
    objTag = objIsArr ? arrayTag : getTag(object),
    othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  let objIsObj = objTag == objectTag,
    othIsObj = othTag == objectTag,
    isSameTag = objTag == othTag;

  if (isSameTag && !!isBuffer && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack());
    return objIsArr || isTypedArray(object)
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    let objIsWrapped = objIsObj && Object.hasOwnProperty.call(object, '__wrapped__'),
      othIsWrapped = othIsObj && Object.hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      let objUnwrapped = objIsWrapped ? object.value() : object,
        othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack());
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack());
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

function baseIsEqual(value: any, other: any, bitmask?: any, customizer?: any, stack?: any) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

/**
 * 执行两个值之间的深度比较，以确定它们是否相等。
 * @param {any} value 要比较的值。
 * @param {any} other 要比较的另一个值。
 * @returns {boolean} 如果值相等，则返回 `true`，否则返回 `false`。
 */
export function isEqual(value: any, other: any): boolean {
  return baseIsEqual(value, other);
}
