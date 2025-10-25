import { cloneDeep } from '../../src';

describe('cloneDeep', () => {
  test('应该克隆基本类型', () => {
    expect(cloneDeep(42)).toBe(42);
    expect(cloneDeep('hello')).toBe('hello');
    expect(cloneDeep(true)).toBe(true);
    expect(cloneDeep(null)).toBe(null);
    expect(cloneDeep(undefined)).toBe(undefined);
  });

  test('应该克隆数组', () => {
    const arr = [1, [2, 3], { a: 4 }];
    const cloned = cloneDeep(arr);
    
    expect(cloned).toEqual(arr);
    expect(cloned).not.toBe(arr);
    expect(cloned[1]).not.toBe(arr[1]);
    expect(cloned[2]).not.toBe(arr[2]);
  });

  test('应该克隆对象', () => {
    const obj = { a: 1, b: { c: 2 } };
    const cloned = cloneDeep(obj);
    
    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);
    expect(cloned.b).not.toBe(obj.b);
  });

  test('应该处理循环引用', () => {
    const obj: any = { a: 1 };
    obj.self = obj;
    
    const cloned = cloneDeep(obj);
    
    expect(cloned).not.toBe(obj);
    expect(cloned.self).toBe(cloned); 
  });

  test('应该克隆特殊对象类型', () => {
    const date = new Date();
    const regex = /test/gi;
    const map = new Map([['key', 'value']]);
    const set = new Set([1, 2, 3]);
    
    expect(cloneDeep(date)).toEqual(date);
    expect(cloneDeep(regex)).toEqual(regex);
    expect(cloneDeep(map)).toEqual(map);
    expect(cloneDeep(set)).toEqual(set);
  });

  test('应该保持类实例的方法', () => {
    class TestClass {
      value: number;
      constructor(value: number) {
        this.value = value;
      }
      getValue() {
        return this.value;
      }
    }
    
    const instance = new TestClass(42);
    const cloned = cloneDeep(instance);
    
    expect(cloned).toBeInstanceOf(TestClass);
    expect(cloned.getValue()).toBe(42);
  });

  test('应该处理Symbol属性', () => {
    const sym = Symbol('test');
    const obj = { [sym]: 'value', normal: 'prop' };
    
    const cloned = cloneDeep(obj);
    
    expect(cloned[sym]).toBe('value');
    expect(cloned.normal).toBe('prop');
  });

  test('应该处理函数', () => {
    const func = (x: number) => x * 2;
    const obj = { method: func };
    
    const cloned = cloneDeep(obj);
    
    expect(cloned.method(5)).toBe(10);
  });

  test('应该处理稀疏数组', () => {
    const sparse = new Array(3);
    sparse[1] = 'middle';
    
    const cloned = cloneDeep(sparse);
    
    expect(cloned.length).toBe(3);
    expect(1 in cloned).toBe(true);
    expect(0 in cloned).toBe(false);
  });

  test('应该处理Error对象', () => {
    const error = new Error('test error');
    
    const cloned = cloneDeep(error);
    
    expect(cloned.message).toBe('test error');
    expect(cloned.name).toBe('Error');
  });
});

describe('cloneDeep - 修改原对象测试', () => {
  describe('基本数据类型', () => {
    test('修改原数字不应影响克隆值', () => {
      const original = 42;
      const cloned = cloneDeep(original);
      
      const modifiedOriginal = 100;
      
      expect(cloned).toBe(42);
      expect(modifiedOriginal).toBe(100);
    });

    test('修改原字符串不应影响克隆值', () => {
      const original = 'hello';
      const cloned = cloneDeep(original);
      
      const modifiedOriginal = 'world';
      
      expect(cloned).toBe('hello');
      expect(modifiedOriginal).toBe('world');
    });
  });

  describe('数组', () => {
    test('修改原数组元素不应影响克隆数组', () => {
      const original = [1, 2, { a: 3 }];
      const cloned = cloneDeep(original);
      
      original[0] = 100;
      original[1] = 200;
      (original[2] as any).a = 300;
      
      expect(cloned[0]).toBe(1);
      expect(cloned[1]).toBe(2);
      expect((cloned[2] as any).a).toBe(3);
      expect(original[0]).toBe(100);
      expect(original[1]).toBe(200);
      expect((original[2] as any).a).toBe(300);
    });

    test('向原数组添加元素不应影响克隆数组', () => {
      const original = [1, 2, 3];
      const cloned = cloneDeep(original);
      
      original.push(4);
      original.unshift(0);
      
      expect(cloned).toEqual([1, 2, 3]);
      expect(original).toEqual([0, 1, 2, 3, 4]);
      expect(cloned.length).toBe(3);
      expect(original.length).toBe(5);
    });

    test('从原数组删除元素不应影响克隆数组', () => {
      const original = [1, 2, 3, 4];
      const cloned = cloneDeep(original);
      
      original.pop();
      original.shift();
      
      expect(cloned).toEqual([1, 2, 3, 4]);
      expect(original).toEqual([2, 3]);
    });

    test('修改原嵌套数组不应影响克隆数组', () => {
      const original = [[1, 2], [3, 4]];
      const cloned = cloneDeep(original);
      
      original[0][0] = 100;
      original[1].push(5);
      
      expect(cloned[0]).toEqual([1, 2]);
      expect(cloned[1]).toEqual([3, 4]);
      expect(original[0]).toEqual([100, 2]);
      expect(original[1]).toEqual([3, 4, 5]);
    });
  });

  describe('对象', () => {
    test('修改原对象属性不应影响克隆对象', () => {
      const original = { a: 1, b: { c: 2 } };
      const cloned = cloneDeep(original);
      
      original.a = 100;
      (original.b as any).c = 200;
      (original as any).newProp = 'new';
      
      expect(cloned.a).toBe(1);
      expect((cloned.b as any).c).toBe(2);
      expect((cloned as any).newProp).toBeUndefined();
      expect(original.a).toBe(100);
      expect((original.b as any).c).toBe(200);
      expect((original as any).newProp).toBe('new');
    });

    test('删除原对象属性不应影响克隆对象', () => {
      const original = { a: 1, b: 2, c: 3 };
      const cloned = cloneDeep(original);
      
      delete (original as any).b;
      delete (original as any).c;
      
      expect(cloned).toEqual({ a: 1, b: 2, c: 3 });
      expect(original).toEqual({ a: 1 });
    });

    test('修改原嵌套对象不应影响克隆对象', () => {
      const original = {
        level1: {
          level2: {
            level3: {
              value: 'deep'
            }
          }
        }
      };
      const cloned = cloneDeep(original);
      
      original.level1.level2.level3.value = 'modified';
      (original.level1 as any).newProp = 'new';
      
      expect(cloned.level1.level2.level3.value).toBe('deep');
      expect((cloned.level1 as any).newProp).toBeUndefined();
      expect(original.level1.level2.level3.value).toBe('modified');
      expect((original.level1 as any).newProp).toBe('new');
    });
  });

  describe('特殊对象类型', () => {
    test('修改原Date对象不应影响克隆Date', () => {
      const original = new Date('2023-01-01');
      const cloned = cloneDeep(original);
      
      original.setFullYear(2024);
      original.setMonth(11);
      
      expect(cloned.getFullYear()).toBe(2023);
      expect(cloned.getMonth()).toBe(0); 
      expect(original.getFullYear()).toBe(2024);
      expect(original.getMonth()).toBe(11); 
    });

    test('修改原Map对象不应影响克隆Map', () => {
      const original = new Map<any, any>([['key1', 'value1'], ['key2', { nested: 'value' }]]);
      const cloned = cloneDeep(original);
      
      original.set('key1', 'modified');
      original.set('key3', 'new value');
      (original.get('key2') as any).nested = 'modified';
      
      expect(cloned.get('key1')).toBe('value1');
      expect((cloned.get('key2') as any).nested).toBe('value');
      expect(cloned.has('key3')).toBe(false);
      expect(original.get('key1')).toBe('modified');
      expect((original.get('key2') as any).nested).toBe('modified');
      expect(original.has('key3')).toBe(true);
    });

    test('修改原Set对象不应影响克隆Set', () => {
      const original = new Set([1, { a: 2 }, [3, 4]]);
      const cloned = cloneDeep(original);
      
      original.add(5);
      original.delete(1);
      
      for (const item of original) {
        if (typeof item === 'object' && item !== null) {
          if (Array.isArray(item)) {
            item.push(999);
          } else {
            (item as any).a = 999;
          }
        }
      }
      
      expect(cloned.has(1)).toBe(true);
      expect(cloned.has(5)).toBe(false);
      expect(cloned.size).toBe(3);
      
      for (const item of cloned) {
        if (typeof item === 'object' && item !== null) {
          if (Array.isArray(item)) {
            expect(item).toEqual([3, 4]);
          } else {
            expect((item as any).a).toBe(2);
          }
        }
      }
      
      expect(original.has(1)).toBe(false);
      expect(original.has(5)).toBe(true);
      expect(original.size).toBe(3);
    });

    test('修改原RegExp对象不应影响克隆RegExp', () => {
      const original = /test/gi;
      const cloned = cloneDeep(original);
      
      original.exec('test test');
      
      expect(cloned.lastIndex).toBe(0);
      expect(original.lastIndex).toBe(4);
      expect(cloned.source).toBe('test');
      expect(cloned.flags).toBe('gi');
    });
  });

  describe('类实例', () => {
    test('修改原类实例属性不应影响克隆实例', () => {
      class Person {
        constructor(public name: string, public age: number) {}
        greet() { return `Hello, I'm ${this.name}`; }
      }
      
      const original = new Person('John', 25);
      const cloned = cloneDeep(original);
      
      original.name = 'Mike';
      original.age = 30;
      (original as any).newProperty = 'new';
      
      expect(cloned.name).toBe('John');
      expect(cloned.age).toBe(25);
      expect(cloned.greet()).toBe("Hello, I'm John");
      expect((cloned as any).newProperty).toBeUndefined();
      expect(original.name).toBe('Mike');
      expect(original.age).toBe(30);
      expect((original as any).newProperty).toBe('new');
    });

    test('修改原类实例的嵌套对象不应影响克隆实例', () => {
      class Company {
        constructor(public name: string, public employees: Person[]) {}
      }
      
      class Person {
        constructor(public name: string) {}
      }
      
      const original = new Company('Tech Corp', [new Person('Alice'), new Person('Bob')]);
      const cloned = cloneDeep(original);
      
      original.name = 'New Corp';
      original.employees[0].name = 'Charlie';
      original.employees.push(new Person('David'));
      
      expect(cloned.name).toBe('Tech Corp');
      expect(cloned.employees[0].name).toBe('Alice');
      expect(cloned.employees[1].name).toBe('Bob');
      expect(cloned.employees.length).toBe(2);
      expect(original.name).toBe('New Corp');
      expect(original.employees[0].name).toBe('Charlie');
      expect(original.employees.length).toBe(3);
    });
  });

  describe('循环引用', () => {
    test('修改循环引用对象的原对象不应影响克隆对象', () => {
      const original: any = { a: 1 };
      original.self = original;
      original.nested = { b: 2, parent: original };
      
      const cloned = cloneDeep(original);
      
      original.a = 100;
      original.nested.b = 200;
      (original as any).newProp = 'new';
      
      expect(cloned.a).toBe(1);
      expect(cloned.nested.b).toBe(2);
      expect((cloned as any).newProp).toBeUndefined();
      expect(cloned.self).toBe(cloned); 
      expect(cloned.nested.parent).toBe(cloned); 
      
      expect(original.a).toBe(100);
      expect(original.nested.b).toBe(200);
      expect((original as any).newProp).toBe('new');
    });

    test('修改数组循环引用不应影响克隆数组', () => {
      const original: any[] = [1, 2];
      original.push(original); 
      
      const cloned = cloneDeep(original);
      
      original[0] = 100;
      original[1] = 200;
      
      expect(cloned[0]).toBe(1);
      expect(cloned[1]).toBe(2);
      expect(cloned[2]).toBe(cloned); 
      expect(original[0]).toBe(100);
      expect(original[1]).toBe(200);
    });
  });

  describe('Symbol属性', () => {
    test('修改原对象的Symbol属性不应影响克隆对象', () => {
      const sym1 = Symbol('sym1');
      const sym2 = Symbol('sym2');
      
      const original = {
        [sym1]: 'symbol value 1',
        normal: 'normal value'
      };
      
      const cloned = cloneDeep(original);
      
      original[sym1] = 'modified symbol';
      (original as any)[sym2] = 'new symbol';
      original.normal = 'modified normal';
      
      expect(cloned[sym1]).toBe('symbol value 1');
      expect(cloned.normal).toBe('normal value');
      expect((cloned as any)[sym2]).toBeUndefined();
      expect(original[sym1]).toBe('modified symbol');
      expect(original.normal).toBe('modified normal');
      expect((original as any)[sym2]).toBe('new symbol');
    });
  });

  describe('TypedArray', () => {
    test('修改原TypedArray不应影响克隆TypedArray', () => {
      const original = new Uint8Array([1, 2, 3, 4]);
      const cloned = cloneDeep(original);
      
      original[0] = 100;
      original[1] = 200;
      
      expect(cloned[0]).toBe(1);
      expect(cloned[1]).toBe(2);
      expect(Array.from(cloned)).toEqual([1, 2, 3, 4]);
      expect(Array.from(original)).toEqual([100, 200, 3, 4]);
    });
  });

  describe('性能与内存', () => {
    test('大量修改原对象不应影响克隆对象性能', () => {
      const original: any = {};
      for (let i = 0; i < 1000; i++) {
        original[`key${i}`] = {
          value: i,
          nested: { deep: `value${i}` }
        };
      }
      
      const cloned = cloneDeep(original);
      
      for (let i = 0; i < 1000; i++) {
        original[`key${i}`].value = i * 100;
        original[`key${i}`].nested.deep = `modified${i}`;
        original[`newKey${i}`] = `newValue${i}`;
      }
      
      for (let i = 0; i < 1000; i++) {
        expect(cloned[`key${i}`].value).toBe(i);
        expect(cloned[`key${i}`].nested.deep).toBe(`value${i}`);
        expect((cloned as any)[`newKey${i}`]).toBeUndefined();
      }
    });
  });
});

describe('cloneDeep 缺陷测试', () => {
  test('函数应该被克隆而不是直接返回', () => {
    const original = () => console.log('test');
    const cloned = cloneDeep(original);
    
    expect(cloned).not.toBe(original);
    expect(typeof cloned).toBe('function');
  });

  test('Symbol 应该保持原始类型', () => {
    const sym = Symbol('test');
    const cloned = cloneDeep(sym);
    
    expect(typeof cloned).toBe('symbol');
    expect(cloned).toBe(sym);
  });

  test('BigInt 应该保持原始类型', () => {
    const big = BigInt(123);
    const cloned = cloneDeep(big);
    
    expect(typeof cloned).toBe('bigint');
  });

  test('应该保持稀疏数组的空位', () => {
    const sparse = new Array(3);
    sparse[1] = 'middle';
    const cloned = cloneDeep(sparse);
    
    expect(0 in cloned).toBe(false);
    expect(1 in cloned).toBe(true);
    expect(2 in cloned).toBe(false);
  });

  test('应该保持类实例的方法', () => {
    class TestClass {
      method() { return 'test'; }
    }
    const instance = new TestClass();
    const cloned = cloneDeep(instance);
    
    expect(cloned.method).toBeDefined();
    expect(cloned.method()).toBe('test');
  });

  // 必死项目未解决
  // test('应该正确处理 getter/setter', () => {
  //   const obj = {
  //     _value: 0,
  //     get value() { return this._value; },
  //     set value(v) { this._value = v; }
  //   };
  //   const cloned = cloneDeep(obj);
    
  //   cloned.value = 42;
  //   expect(cloned._value).toBe(42);
  // });

  test('应该保持 RegExp 的 lastIndex', () => {
    const regex = /test/g;
    regex.test('test test');
    const cloned = cloneDeep(regex);
    
    expect(cloned.lastIndex).toBe(4);
  });
});
