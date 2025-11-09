import { isEqual } from '../../src';

describe('isEqual (综合测试套件)', () => {

  // --- 1. 原始类型和基本情况 -------------------------------------------

  describe('🧪 原始类型', () => {
    it('应该正确比较 undefined', () => {
      expect(isEqual(undefined, undefined)).toBe(true);
      expect(isEqual(undefined, null)).toBe(false);
    });

    it('应该正确比较 null', () => {
      expect(isEqual(null, null)).toBe(true);
      expect(isEqual(null, undefined)).toBe(false);
      expect(isEqual(null, {})).toBe(false);
    });

    it('应该正确比较布尔值', () => {
      expect(isEqual(true, true)).toBe(true);
      expect(isEqual(false, false)).toBe(true);
      expect(isEqual(true, false)).toBe(false);
      expect(isEqual(true, 1)).toBe(false);
    });

    it('应该正确比较字符串', () => {
      expect(isEqual('hello', 'hello')).toBe(true);
      expect(isEqual('hello', 'world')).toBe(false);
      expect(isEqual('hello', new String('hello'))).toBe(true); // 包装器对象
      expect(isEqual(new String('hello'), 'hello')).toBe(true); // 包装器对象
      expect(isEqual(new String('hello'), new String('hello'))).toBe(true);
    });

    it('应该正确比较数字', () => {
      expect(isEqual(123, 123)).toBe(true);
      expect(isEqual(123, 456)).toBe(false);
      expect(isEqual(123, new Number(123))).toBe(true); // 包装器对象
      expect(isEqual(new Number(123), 123)).toBe(true); // 包装器对象
      expect(isEqual(new Number(123), new Number(123))).toBe(true);
    });

    it('应该正确比较 NaN', () => {
      // NaN 是唯一一个不等于自身的值，isEqual 应该处理这个
      expect(isEqual(NaN, NaN)).toBe(true);
      expect(isEqual(NaN, 1)).toBe(false);
    });

    it('应该正确比较 Symbols', () => {
      const sym1 = Symbol('a');
      const sym2 = Symbol('a');
      const sym3 = Symbol('b');

      expect(isEqual(sym1, sym1)).toBe(true); // 同一个 Symbol
      expect(isEqual(sym1, sym2)).toBe(false); // 描述相同但实例不同
      expect(isEqual(sym1, sym3)).toBe(false);
      expect(isEqual(Object(sym1), Object(sym1))).toBe(true); // 包装器
      expect(isEqual(Object(sym1), sym1)).toBe(true);
    });
  });

  // --- 2. 数组 -----------------------------------------------------------

  describe('🧪 数组 (Array)', () => {
    it('应该比较空数组', () => {
      expect(isEqual([], [])).toBe(true);
      expect(isEqual([], [1])).toBe(false);
    });

    it('应该比较简单数组', () => {
      expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(isEqual([1, 2, 3], [1, 2])).toBe(false);
      expect(isEqual(['a', 'b'], ['a', 'b'])).toBe(true);
    });

    it('应该比较嵌套数组', () => {
      const arr1 = [1, [2, [3, 4]], 5];
      const arr2 = [1, [2, [3, 4]], 5];
      const arr3 = [1, [2, [3, 99]], 5];
      expect(isEqual(arr1, arr2)).toBe(true);
      expect(isEqual(arr1, arr3)).toBe(false);
    });

    it('应该比较包含 null 和 undefined 的数组', () => {
      expect(isEqual([1, null, 3], [1, null, 3])).toBe(true);
      expect(isEqual([1, undefined, 3], [1, undefined, 3])).toBe(true);
      expect(isEqual([1, null, 3], [1, undefined, 3])).toBe(false);
    });

    it('应该比较稀疏数组', () => {
      // eslint-disable-next-line no-sparse-arrays
      expect(isEqual([1, , 3], [1, , 3])).toBe(true);
      // eslint-disable-next-line no-sparse-arrays
      expect(isEqual([1, , 3], [1, 2, 3])).toBe(false);
      // 稀疏数组 vs 显式 undefined
      // eslint-disable-next-line no-sparse-arrays
      expect(isEqual([1, , 3], [1, undefined, 3])).toBe(true);
    });

    it('应该比较包含复杂对象的数组', () => {
      const arr1 = [{ a: 1 }, { b: { c: 2 } }];
      const arr2 = [{ a: 1 }, { b: { c: 2 } }];
      const arr3 = [{ a: 1 }, { b: { c: 99 } }];
      expect(isEqual(arr1, arr2)).toBe(true);
      expect(isEqual(arr1, arr3)).toBe(false);
    });
  });

  // --- 3. 对象 (Object) ----------------------------------------------------

  describe('🧪 对象 (Object)', () => {
    it('应该比较空对象', () => {
      expect(isEqual({}, {})).toBe(true);
      expect(isEqual({}, { a: 1 })).toBe(false);
    });

    it('应该比较简单对象（键顺序无关）', () => {
      expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
      expect(isEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
      expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
    });

    it('应该比较具有不同键的对象', () => {
      expect(isEqual({ a: 1, b: 2 }, { a: 1, c: 2 })).toBe(false);
    });

    it('应该比较具有不同数量键的对象', () => {
      expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2, c: 3 })).toBe(false);
      expect(isEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 })).toBe(false);
    });

    it('应该比较嵌套对象', () => {
      const obj1 = { a: 1, b: { c: 3, d: { e: 4 } } };
      const obj2 = { a: 1, b: { c: 3, d: { e: 4 } } };
      const obj3 = { a: 1, b: { c: 3, d: { e: 99 } } };
      expect(isEqual(obj1, obj2)).toBe(true);
      expect(isEqual(obj1, obj3)).toBe(false);
    });

    it('应该比较包含 null 和 undefined 值的对象', () => {
      expect(isEqual({ a: 1, b: null }, { a: 1, b: null })).toBe(true);
      expect(isEqual({ a: 1, b: undefined }, { a: 1, b: undefined })).toBe(true);
      expect(isEqual({ a: 1, b: null }, { a: 1, b: undefined })).toBe(false);
    });

    it('应该区分 undefined 值和不存在的键', () => {
      expect(isEqual({ a: 1, b: undefined }, { a: 1 })).toBe(false);
      expect(isEqual({ a: 1 }, { a: 1, b: undefined })).toBe(false);
    });

    it('应该比较带 Symbol 键的对象', () => {
      const symA = Symbol('a');
      const symB = Symbol('b');
      const obj1 = { [symA]: 1, [symB]: 2 };
      const obj2 = { [symA]: 1, [symB]: 2 };
      const obj3 = { [symA]: 1, [symB]: 99 };
      expect(isEqual(obj1, obj2)).toBe(true);
      expect(isEqual(obj1, obj3)).toBe(false);
    });

    it('应该比较具有不同原型的对象', () => {
      // @ts-ignore
      function Foo() { (this as any).a = 1; }
      // @ts-ignore
      function Bar() { (this as any).a = 1; }
      const foo = new (Foo as any)();
      const bar = new (Bar as any)();

      expect(isEqual(foo, bar)).toBe(false);
      expect(isEqual({}, Object.create(null))).toBe(true);
      expect(isEqual({ a: 1 }, Object.create(null, { a: { value: 1, enumerable: true } }))).toBe(true);
    });

    it('应该比较 Arguments 对象', () => {
      function getArgs(...args: any[]): IArguments {
        return arguments;
      }
      const args1 = getArgs(1, 2, 3);
      const args2 = getArgs(1, 2, 3);
      const args3 = getArgs(1, 2, 4);

      expect(isEqual(args1, args2)).toBe(true);
      expect(isEqual(args1, args3)).toBe(false);
      expect(isEqual(args1, [1, 2, 3])).toBe(false); // Tag 不同
    });
  });

  // --- 4. 集合 (Map, Set) -------------------------------------------------

  describe('🧪 集合 (Map)', () => {
    it('应该比较空 Map', () => {
      expect(isEqual(new Map(), new Map())).toBe(true);
    });

    it('应该比较具有相同原始键值对的 Map (顺序无关)', () => {
      const map1 = new Map([['a', 1], ['b', 2]]);
      const map2 = new Map([['b', 2], ['a', 1]]);
      expect(isEqual(map1, map2)).toBe(true);
    });

    it('应该比较具有不同值的 Map', () => {
      const map1 = new Map([['a', 1], ['b', 2]]);
      const map2 = new Map([['a', 1], ['b', 99]]);
      expect(isEqual(map1, map2)).toBe(false);
    });

    it('应该比较具有不同键的 Map', () => {
      const map1 = new Map([['a', 1], ['b', 2]]);
      const map2 = new Map([['a', 1], ['c', 2]]);
      expect(isEqual(map1, map2)).toBe(false);
    });

    it('应该比较具有不同大小的 Map', () => {
      const map1 = new Map([['a', 1], ['b', 2]]);
      const map2 = new Map([['a', 1]]);
      expect(isEqual(map1, map2)).toBe(false);
    });

    it('应该比较具有 NaN 键的 Map', () => {
      const map1 = new Map([[NaN, 1]]);
      const map2 = new Map([[NaN, 1]]);
      const map3 = new Map([[NaN, 2]]);
      expect(isEqual(map1, map2)).toBe(true);
      expect(isEqual(map1, map3)).toBe(false);
    });

    it('应该比较具有对象键和值的 Map (深度比较)', () => {
      const map1 = new Map([[{ a: 1 }, { b: 2 }]]);
      const map2 = new Map([[{ a: 1 }, { b: 2 }]]);
      const map3 = new Map([[{ a: 99 }, { b: 2 }]]);
      const map4 = new Map([[{ a: 1 }, { b: 99 }]]);
      expect(isEqual(map1, map2)).toBe(true);
      expect(isEqual(map1, map3)).toBe(false); // 键不同
      expect(isEqual(map1, map4)).toBe(false); // 值不同
    });

    it('应该比较嵌套 Map', () => {
      const map1 = new Map([['a', new Map([['b', 1]])]]);
      const map2 = new Map([['a', new Map([['b', 1]])]]);
      const map3 = new Map([['a', new Map([['b', 99]])]]);
      expect(isEqual(map1, map2)).toBe(true);
      expect(isEqual(map1, map3)).toBe(false);
    });
  });

  describe('🧪 集合 (Set)', () => {
    it('应该比较空 Set', () => {
      expect(isEqual(new Set(), new Set())).toBe(true);
    });

    it('应该比较具有相同原始值的 Set (顺序无关)', () => {
      const set1 = new Set([1, 2, 3]);
      const set2 = new Set([3, 1, 2]);
      expect(isEqual(set1, set2)).toBe(true);
    });

    it('应该比较具有不同值的 Set', () => {
      const set1 = new Set([1, 2, 3]);
      const set2 = new Set([1, 2, 4]);
      expect(isEqual(set1, set2)).toBe(false);
    });

    it('应该比较具有不同大小的 Set', () => {
      const set1 = new Set([1, 2, 3]);
      const set2 = new Set([1, 2]);
      expect(isEqual(set1, set2)).toBe(false);
    });

    it('应该比较具有 NaN 值的 Set', () => {
      const set1 = new Set([NaN, 1]);
      const set2 = new Set([1, NaN]);
      expect(isEqual(set1, set2)).toBe(true);
    });

    it('应该比较具有对象值的 Set (深度比较)', () => {
      const set1 = new Set([{ a: 1 }, { b: 2 }]);
      const set2 = new Set([{ b: 2 }, { a: 1 }]); // 顺序无关
      const set3 = new Set([{ a: 1 }, { b: 99 }]);
      expect(isEqual(set1, set2)).toBe(true);
      expect(isEqual(set1, set3)).toBe(false);
    });

    it('应该比较嵌套 Set', () => {
      const set1 = new Set([new Set([1, 2])]);
      const set2 = new Set([new Set([2, 1])]); // 内部顺序也无关
      const set3 = new Set([new Set([1, 99])]);
      expect(isEqual(set1, set2)).toBe(true);
      expect(isEqual(set1, set3)).toBe(false);
    });
  });

  // --- 5. 特殊对象类型 ----------------------------------------------------

  describe('🧪 特殊对象类型 (Date, RegExp, Error)', () => {
    it('应该比较 Date 对象', () => {
      const date1 = new Date(123456789);
      const date2 = new Date(123456789);
      const date3 = new Date(987654321);
      const invalidDate = new Date(NaN);

      expect(isEqual(date1, date2)).toBe(true);
      expect(isEqual(date1, date3)).toBe(false);
      expect(isEqual(invalidDate, invalidDate)).toBe(true); // NaN Date
      expect(isEqual(date1, invalidDate)).toBe(false);
    });

    it('应该比较 RegExp 对象', () => {
      const regex1 = /abc/gi;
      const regex2 = /abc/gi;
      const regex3 = /abc/g; // flags 不同
      const regex4 = /def/gi; // source 不同

      expect(isEqual(regex1, regex2)).toBe(true);
      expect(isEqual(regex1, regex3)).toBe(false);
      expect(isEqual(regex1, regex4)).toBe(false);
      expect(isEqual(new RegExp('a'), new RegExp('a'))).toBe(true);
    });

    it('应该比较 Error 对象', () => {
      const error1 = new Error('test message');
      const error2 = new Error('test message');
      const error3 = new Error('different message');
      const typeError = new TypeError('test message');

      expect(isEqual(error1, error2)).toBe(true);
      expect(isEqual(error1, error3)).toBe(false);
      expect(isEqual(error1, typeError)).toBe(false); // Tag (类型) 不同
    });
  });

  // --- 6. Buffers 和 TypedArrays ------------------------------------------

  describe('🧪 Buffers 和 TypedArrays', () => {
    // 只有在 Node.js 环境中才测试 Buffer
    const isNode = typeof Buffer !== 'undefined' && typeof Buffer.from === 'function';

    if (isNode) {
      it('应该比较 Buffer 对象', () => {
        const buf1 = Buffer.from('hello');
        const buf2 = Buffer.from('hello');
        const buf3 = Buffer.from('world');
        expect(isEqual(buf1, buf2)).toBe(true);
        expect(isEqual(buf1, buf3)).toBe(false);
      });
    }

    it('应该比较 ArrayBuffer 对象', () => {
      const buffer1 = new Uint8Array([1, 2, 3]).buffer;
      const buffer2 = new Uint8Array([1, 2, 3]).buffer;
      const buffer3 = new Uint8Array([1, 2, 99]).buffer;
      expect(isEqual(buffer1, buffer2)).toBe(true);
      expect(isEqual(buffer1, buffer3)).toBe(false);
    });

    it('应该比较 DataView 对象', () => {
      const view1 = new DataView(new Uint8Array([1, 2, 3]).buffer);
      const view2 = new DataView(new Uint8Array([1, 2, 3]).buffer);
      const view3 = new DataView(new Uint8Array([1, 2, 99]).buffer);
      // 比较 DataView（及其底层的 ArrayBuffer）
      expect(isEqual(view1, view2)).toBe(true);
      expect(isEqual(view1, view3)).toBe(false);
    });

    it('应该比较各种 TypedArray', () => {
      const u8_1 = new Uint8Array([1, 2, 3]);
      const u8_2 = new Uint8Array([1, 2, 3]);
      const u8_3 = new Uint8Array([1, 2, 4]);

      const i32_1 = new Int32Array([100, 200]);
      const i32_2 = new Int32Array([100, 200]);

      const f64_1 = new Float64Array([0.1, 0.2]);
      const f64_2 = new Float64Array([0.1, 0.2]);

      expect(isEqual(u8_1, u8_2)).toBe(true);
      expect(isEqual(u8_1, u8_3)).toBe(false);
      expect(isEqual(i32_1, i32_2)).toBe(true);
      expect(isEqual(f64_1, f64_2)).toBe(true);

      // 不同类型的 TypedArray 即使值相同也不相等
      const u16_1 = new Uint16Array([1, 2, 3]);
      expect(isEqual(u8_1, u16_1)).toBe(false);
    });
  });

  // --- 7. 类型不匹配 ------------------------------------------------------

  describe('🧪 类型不匹配', () => {
    it('应该区分数组和类数组对象', () => {
      expect(isEqual([1, 2, 3], { 0: 1, 1: 2, 2: 3, length: 3 })).toBe(false);
    });

    it('应该区分对象和原始类型', () => {
      expect(isEqual({}, null)).toBe(false);
      expect(isEqual({}, undefined)).toBe(false);
      expect(isEqual({ a: 1 }, 123)).toBe(false);
      expect(isEqual({ a: 1 }, 'hello')).toBe(false);
    });

    it('应该区分 Set 和 Array', () => {
      expect(isEqual(new Set([1, 2]), [1, 2])).toBe(false);
    });

    it('应该区分 Map 和 Object', () => {
      expect(isEqual(new Map([['a', 1]]), { a: 1 })).toBe(false);
    });
  });

  // --- 8. 循环引用 (Stack 处理) -------------------------------------------

  describe('🧪 循环引用', () => {
    it('应该处理对象中的简单自引用', () => {
      const a: any = { name: 'a' };
      a.self = a;

      const b: any = { name: 'a' };
      b.self = b;

      const c: any = { name: 'c' };
      c.self = c;

      expect(isEqual(a, b)).toBe(true);
      expect(isEqual(a, c)).toBe(false);
    });

    it('应该处理数组中的简单自引用', () => {
      const arr1: any[] = [1, 2];
      arr1.push(arr1);

      const arr2: any[] = [1, 2];
      arr2.push(arr2);

      const arr3: any[] = [1, 3]; // 值不同
      arr3.push(arr3);

      expect(isEqual(arr1, arr2)).toBe(true);
      expect(isEqual(arr1, arr3)).toBe(false);
    });

    it('应该处理对象间的相互引用', () => {
      const objA1: any = { name: 'A' };
      const objB1: any = { name: 'B' };
      objA1.friend = objB1;
      objB1.friend = objA1;

      const objA2: any = { name: 'A' };
      const objB2: any = { name: 'B' };
      objA2.friend = objB2;
      objB2.friend = objA2;

      const objA3: any = { name: 'A' };
      const objB3: any = { name: 'C' }; // B 的 name 不同
      objA3.friend = objB3;
      objB3.friend = objA3;

      expect(isEqual(objA1, objA2)).toBe(true);
      expect(isEqual(objA1, objA3)).toBe(false);
    });

    it('应该处理集合中的循环引用', () => {
      // Map
      const mapA = new Map<string, any>();
      mapA.set('self', mapA);
      const mapB = new Map<string, any>();
      mapB.set('self', mapB);
      const mapC = new Map<string, any>();
      mapC.set('other', mapC);

      expect(isEqual(mapA, mapB)).toBe(true);
      expect(isEqual(mapA, mapC)).toBe(false); // 键名不同

      // Set
      const setA = new Set<any>();
      setA.add(setA);
      const setB = new Set<any>();
      setB.add(setB);
      const setC = new Set<any>();
      setC.add(1); // 值不同

      expect(isEqual(setA, setB)).toBe(true);
      expect(isEqual(setA, setC)).toBe(false);
    });

    it('应该处理复杂的混合循环引用', () => {
      const a: any = {};
      const b: any = {};
      a.b = b;
      b.a = a;

      const c: any = {};
      const d: any = {};
      c.b = d;
      d.a = c;

      const list1 = [a, b];
      const list2 = [c, d];

      // list1 和 list2 结构相同，但内部的 a/c, b/d 实例不同
      // 但 a 和 c 深度相等，b 和 d 深度相等
      expect(isEqual(list1, list2)).toBe(true);

      // 引入一个不等点
      d.a = { different: true };
      expect(isEqual(list1, list2)).toBe(false);
    });
  });

  // --- 9. 特殊的 Lodash 包装器 ( __wrapped__ ) -----------------------------

  describe('🧪 Lodash 包装器 (__wrapped__)', () => {
    // 模拟 Lodash 包装器对象
    const createWrapper = (val: any) => ({
      __wrapped__: val,
      value: () => val,
    });

    const wrapperA = createWrapper({ a: 1, b: { c: 2 } });
    const wrapperB = createWrapper({ a: 1, b: { c: 2 } });
    const wrapperC = createWrapper({ a: 1, b: { c: 99 } });
    const regularObj = { a: 1, b: { c: 2 } };
    const regularObjFake = { __wrapped__: 1, value: () => 1 };

    it('应该解包并比较两个包装器对象', () => {
      expect(isEqual(wrapperA, wrapperB)).toBe(true);
      expect(isEqual(wrapperA, wrapperC)).toBe(false);
    });

    it('应该解包并比较包装器对象和常规对象', () => {
      expect(isEqual(wrapperA, regularObj)).toBe(true);
      expect(isEqual(regularObj, wrapperA)).toBe(true);
    });

    it('应该将带有 __wrapped__ 键的常规对象视为常规对象', () => {
      // wrapperA 会被解包, regularObjFake 不会
      expect(isEqual(wrapperA, regularObjFake)).toBe(false);
      // 两者都只是普通对象，结构不同
      expect(isEqual(regularObjFake, { a: 1 })).toBe(false);
    });
  });
});