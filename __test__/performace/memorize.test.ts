const { memorize, Memorize } = require('../../src');

describe('memorize 缓存函数', () => {
  test('应该缓存基本类型参数的结果', () => {
    const mockFn = jest.fn((x: number) => x * 2);
    const memorizedFn = memorize(mockFn);

    const result1 = memorizedFn(5);
    const result2 = memorizedFn(5);

    expect(result1).toBe(10);
    expect(result2).toBe(10);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('应该缓存字符串参数的结果', () => {
    const mockFn = jest.fn((str: string) => str.toUpperCase());
    const memorizedFn = memorize(mockFn);

    const result1 = memorizedFn('hello');
    const result2 = memorizedFn('hello');

    expect(result1).toBe('HELLO');
    expect(result2).toBe('HELLO');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('应该缓存多个参数的结果', () => {
    const mockFn = jest.fn((a: number, b: string, c: boolean) => `${a}-${b}-${c}`);
    const memorizedFn = memorize(mockFn);

    const result1 = memorizedFn(1, 'test', true);
    const result2 = memorizedFn(1, 'test', true);

    expect(result1).toBe('1-test-true');
    expect(result2).toBe('1-test-true');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('应该缓存对象参数的结果（基于引用比较）', () => {
    const mockFn = jest.fn((obj: any) => obj.value * 2);
    const memorizedFn = memorize(mockFn);

    const obj = { value: 5 };
    const result1 = memorizedFn(obj);
    const result2 = memorizedFn(obj);

    expect(result1).toBe(10);
    expect(result2).toBe(10);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('不同引用的相同内容对象应该分别缓存', () => {
    const mockFn = jest.fn((obj: any) => obj.value * 2);
    const memorizedFn = memorize(mockFn);

    const obj1 = { value: 5 };
    const obj2 = { value: 5 };
    
    const result1 = memorizedFn(obj1);
    const result2 = memorizedFn(obj2);

    expect(result1).toBe(10);
    expect(result2).toBe(10);
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  test('应该缓存函数参数的结果', () => {
    const mockFn = jest.fn((fn: Function) => fn.name);
    const memorizedFn = memorize(mockFn);

    const testFunction = function testFunc() {};
    const result1 = memorizedFn(testFunction);
    const result2 = memorizedFn(testFunction);

    expect(result1).toBe('testFunc');
    expect(result2).toBe('testFunc');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('应该缓存数组参数的结果', () => {
    const mockFn = jest.fn((arr: number[]) => arr.reduce((sum, n) => sum + n, 0));
    const memorizedFn = memorize(mockFn);

    const arr = [1, 2, 3, 4, 5];
    const result1 = memorizedFn(arr);
    const result2 = memorizedFn(arr);

    expect(result1).toBe(15);
    expect(result2).toBe(15);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('应该正确处理 undefined 和 null 参数', () => {
    const mockFn = jest.fn((a: any, b: any) => `${a}-${b}`);
    const memorizedFn = memorize(mockFn);

    const result1 = memorizedFn(undefined, null);
    const result2 = memorizedFn(undefined, null);

    expect(result1).toBe('undefined-null');
    expect(result2).toBe('undefined-null');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('应该正确处理空参数列表', () => {
    const mockFn = jest.fn(() => 'no args');
    const memorizedFn = memorize(mockFn);

    const result1 = memorizedFn();
    const result2 = memorizedFn();

    expect(result1).toBe('no args');
    expect(result2).toBe('no args');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('应该正确绑定 this 上下文', () => {
    const context = { multiplier: 10 };
    let receivedContext: any = null;

    function testFn(this: any, x: number) {
      receivedContext = this;
      return x * this.multiplier;
    }

    const memorizedFn = memorize(testFn);
    const result = memorizedFn.call(context, 5);

    expect(result).toBe(50);
    expect(receivedContext).toBe(context);
  });

  test('应该缓存异步函数的结果', async () => {
    const mockFn = jest.fn(async (x: number) => {
      await new Promise(resolve => setTimeout(resolve, 10));
      return x * 2;
    });

    const memorizedFn = memorize(mockFn);

    const result1 = await memorizedFn(5);
    const result2 = await memorizedFn(5);

    expect(result1).toBe(10);
    expect(result2).toBe(10);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('应该缓存返回对象的结果', () => {
    const mockFn = jest.fn((x: number) => ({ value: x, doubled: x * 2 }));
    const memorizedFn = memorize(mockFn);

    const result1 = memorizedFn(5);
    const result2 = memorizedFn(5);

    expect(result1).toEqual({ value: 5, doubled: 10 });
    expect(result2).toEqual({ value: 5, doubled: 10 });
    expect(result1).toBe(result2); // 应该返回相同的引用
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('应该缓存返回数组的结果', () => {
    const mockFn = jest.fn((x: number) => [x, x * 2, x * 3]);
    const memorizedFn = memorize(mockFn);

    const result1 = memorizedFn(3);
    const result2 = memorizedFn(3);

    expect(result1).toEqual([3, 6, 9]);
    expect(result2).toEqual([3, 6, 9]);
    expect(result1).toBe(result2); // 应该返回相同的引用
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('应该缓存返回函数的结果', () => {
    const mockFn = jest.fn((x: number) => (y: number) => x + y);
    const memorizedFn = memorize(mockFn);

    const result1 = memorizedFn(5);
    const result2 = memorizedFn(5);

    expect(result1).toBe(result2); // 应该返回相同的函数引用
    expect(result1(3)).toBe(8);
    expect(result2(3)).toBe(8);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('应该正确处理复杂嵌套参数', () => {
    const mockFn = jest.fn((obj: any) => obj.a.b.c);
    const memorizedFn = memorize(mockFn);

    const complexObj = {
      a: {
        b: {
          c: 'deep value'
        }
      }
    };

    const result1 = memorizedFn(complexObj);
    const result2 = memorizedFn(complexObj);

    expect(result1).toBe('deep value');
    expect(result2).toBe('deep value');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('应该正确处理 Symbol 参数', () => {
    const mockFn = jest.fn((sym: symbol) => sym.toString());
    const memorizedFn = memorize(mockFn);

    const sym = Symbol('test');
    const result1 = memorizedFn(sym);
    const result2 = memorizedFn(sym);

    expect(result1).toBe('Symbol(test)');
    expect(result2).toBe('Symbol(test)');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('应该正确处理 BigInt 参数', () => {
    const mockFn = jest.fn((big: bigint) => big.toString());
    const memorizedFn = memorize(mockFn);

    const big = BigInt(123456789);
    const result1 = memorizedFn(big);
    const result2 = memorizedFn(big);

    expect(result1).toBe('123456789');
    expect(result2).toBe('123456789');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('应该正确处理 Date 参数', () => {
    const mockFn = jest.fn((date: Date) => date.getTime());
    const memorizedFn = memorize(mockFn);

    const date = new Date('2023-01-01');
    const result1 = memorizedFn(date);
    const result2 = memorizedFn(date);

    expect(result1).toBe(date.getTime());
    expect(result2).toBe(date.getTime());
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('应该正确处理 RegExp 参数', () => {
    const mockFn = jest.fn((regex: RegExp) => regex.source);
    const memorizedFn = memorize(mockFn);

    const regex = /test/gi;
    const result1 = memorizedFn(regex);
    const result2 = memorizedFn(regex);

    expect(result1).toBe('test');
    expect(result2).toBe('test');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('应该正确处理 Map 参数', () => {
    const mockFn = jest.fn((map: Map<any, any>) => map.size);
    const memorizedFn = memorize(mockFn);

    const map = new Map([['key1', 'value1'], ['key2', 'value2']]);
    const result1 = memorizedFn(map);
    const result2 = memorizedFn(map);

    expect(result1).toBe(2);
    expect(result2).toBe(2);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('应该正确处理 Set 参数', () => {
    const mockFn = jest.fn((set: Set<any>) => set.size);
    const memorizedFn = memorize(mockFn);

    const set = new Set([1, 2, 3, 4, 5]);
    const result1 = memorizedFn(set);
    const result2 = memorizedFn(set);

    expect(result1).toBe(5);
    expect(result2).toBe(5);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('应该正确处理混合类型参数', () => {
    const mockFn = jest.fn((...args: any[]) => args.map(arg => typeof arg).join('-'));
    const memorizedFn = memorize(mockFn);

    const args = [1, 'string', true, null, undefined, {}, [], Symbol('test')];
    const result1 = memorizedFn(...args);
    const result2 = memorizedFn(...args);

    expect(result1).toBe('number-string-boolean-object-undefined-object-object-symbol');
    expect(result2).toBe('number-string-boolean-object-undefined-object-object-symbol');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('应该正确处理错误情况', () => {
    const mockFn = jest.fn((x: number) => {
      if (x < 0) throw new Error('Negative number');
      return x * 2;
    });

    const memorizedFn = memorize(mockFn);

    // 第一次调用应该抛出错误
    expect(() => memorizedFn(-1)).toThrow('Negative number');
    expect(mockFn).toHaveBeenCalledTimes(1);

    // 第二次调用相同参数应该再次抛出错误（因为错误也被缓存了）
    expect(() => memorizedFn(-1)).toThrow('Negative number');
    expect(mockFn).toHaveBeenCalledTimes(2); // 错误不会被缓存，会重新执行
  });

  test('应该正确处理返回 Promise 的函数', async () => {
    const mockFn = jest.fn(async (x: number) => {
      return new Promise(resolve => {
        setTimeout(() => resolve(x * 2), 10);
      });
    });

    const memorizedFn = memorize(mockFn);

    const promise1 = memorizedFn(5);
    const promise2 = memorizedFn(5);

    const [result1, result2] = await Promise.all([promise1, promise2]);

    expect(result1).toBe(10);
    expect(result2).toBe(10);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('应该正确处理类方法', () => {
    class Calculator {
      multiply(x: number, y: number) {
        return x * y;
      }
    }

    const calc = new Calculator();
    const memorizedMultiply = memorize(calc.multiply.bind(calc));

    const result1 = memorizedMultiply(3, 4);
    const result2 = memorizedMultiply(3, 4);

    expect(result1).toBe(12);
    expect(result2).toBe(12);
  });

  test('应该正确处理箭头函数', () => {
    const arrowFn = (x: number, y: number) => x + y;
    const memorizedFn = memorize(arrowFn);

    const result1 = memorizedFn(2, 3);
    const result2 = memorizedFn(2, 3);

    expect(result1).toBe(5);
    expect(result2).toBe(5);
  });

  test('应该正确处理生成器函数', () => {
    function* generator(x: number) {
      yield x;
      yield x * 2;
      yield x * 3;
    }

    const memorizedGenerator = memorize(generator);

    const gen1 = memorizedGenerator(2);
    const values1 = Array.from(gen1);
    expect(values1).toEqual([2, 4, 6]);

    const gen2 = memorizedGenerator(2);
    const values2 = Array.from(gen2);
    expect(values2).toEqual([]);
  });

  test('应该正确处理递归函数', () => {
    const fibonacci = (n: number): number => {
      if (n <= 1) return n;
      return fibonacci(n - 1) + fibonacci(n - 2);
    };

    const memorizedFibonacci = memorize(fibonacci);

    const result1 = memorizedFibonacci(10);
    const result2 = memorizedFibonacci(10);

    expect(result1).toBe(55);
    expect(result2).toBe(55);
  });
});

describe('memorize 性能测试', () => {
  test('应该显著提高重复调用的性能', () => {
    const expensiveFn = (n: number) => {
      // 模拟昂贵的计算
      let result = 0;
      for (let i = 0; i < n * 1000000; i++) {
        result += i;
      }
      return result;
    };

    const memorizedFn = memorize(expensiveFn);

    const start1 = performance.now();
    memorizedFn(100);
    const end1 = performance.now();
    const time1 = end1 - start1;

    const start2 = performance.now();
    memorizedFn(100);
    const end2 = performance.now();
    const time2 = end2 - start2;

    // 第二次调用应该明显更快（从缓存返回）
    expect(time2).toBeLessThan(time1);
  });

  test('应该正确处理大量不同参数的缓存', () => {
    const mockFn = jest.fn((x: number) => x * 2);
    const memorizedFn = memorize(mockFn);

    // 调用1000次不同的参数
    for (let i = 0; i < 1000; i++) {
      memorizedFn(i);
    }

    expect(mockFn).toHaveBeenCalledTimes(1000);

    // 再次调用相同的参数应该从缓存返回
    for (let i = 0; i < 1000; i++) {
      memorizedFn(i);
    }

    expect(mockFn).toHaveBeenCalledTimes(1000); // 没有额外的调用
  });
});

describe('memorize 边界情况测试', () => {
  test('应该正确处理 NaN 参数', () => {
    const mockFn = jest.fn((x: number) => isNaN(x));
    const memorizedFn = memorize(mockFn);

    const result1 = memorizedFn(NaN);
    const result2 = memorizedFn(NaN);

    expect(result1).toBe(true);
    expect(result2).toBe(true);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('应该正确处理 Infinity 参数', () => {
    const mockFn = jest.fn((x: number) => x === Infinity);
    const memorizedFn = memorize(mockFn);

    const result1 = memorizedFn(Infinity);
    const result2 = memorizedFn(Infinity);

    expect(result1).toBe(true);
    expect(result2).toBe(true);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('应该正确处理 -Infinity 参数', () => {
    const mockFn = jest.fn((x: number) => x === -Infinity);
    const memorizedFn = memorize(mockFn);

    const result1 = memorizedFn(-Infinity);
    const result2 = memorizedFn(-Infinity);

    expect(result1).toBe(true);
    expect(result2).toBe(true);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('应该正确处理 0 和 -0 参数', () => {
    const mockFn = jest.fn((x: number) => Object.is(x, 0));
    const memorizedFn = memorize(mockFn);

    const result1 = memorizedFn(0);
    const result2 = memorizedFn(-0);

    expect(result1).toBe(true);
    // 注意：在 Map 中，0 和 -0 被视为相同的键，所以第二次调用会返回缓存的结果
    expect(result2).toBe(true); // 从缓存返回，所以是 true
    expect(mockFn).toHaveBeenCalledTimes(1); // 只调用了一次
  });

  test('应该正确处理空字符串参数', () => {
    const mockFn = jest.fn((str: string) => str.length);
    const memorizedFn = memorize(mockFn);

    const result1 = memorizedFn('');
    const result2 = memorizedFn('');

    expect(result1).toBe(0);
    expect(result2).toBe(0);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('应该正确处理空对象参数', () => {
    const mockFn = jest.fn((obj: any) => Object.keys(obj).length);
    const memorizedFn = memorize(mockFn);

    const emptyObj = {};
    const result1 = memorizedFn(emptyObj);
    const result2 = memorizedFn(emptyObj);

    expect(result1).toBe(0);
    expect(result2).toBe(0);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('应该正确处理空数组参数', () => {
    const mockFn = jest.fn((arr: any[]) => arr.length);
    const memorizedFn = memorize(mockFn);

    const emptyArr: any[] = [];
    const result1 = memorizedFn(emptyArr);
    const result2 = memorizedFn(emptyArr);

    expect(result1).toBe(0);
    expect(result2).toBe(0);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});

describe('Memorize 装饰器', () => {
  test('应该缓存类方法的执行结果', () => {
    class Calculator {
      private callCount = 0;

      @Memorize
      expensiveCalculation(n: number): number {
        this.callCount++;
        // 模拟昂贵的计算
        return n * n * n;
      }

      getCallCount(): number {
        return this.callCount;
      }
    }

    const calc = new Calculator();

    // 第一次调用
    const result1 = calc.expensiveCalculation(5);
    expect(result1).toBe(125);
    expect(calc.getCallCount()).toBe(1);

    // 第二次调用相同参数，应该从缓存返回
    const result2 = calc.expensiveCalculation(5);
    expect(result2).toBe(125);
    expect(calc.getCallCount()).toBe(1); // 调用次数没有增加

    // 不同参数应该重新计算
    const result3 = calc.expensiveCalculation(3);
    expect(result3).toBe(27);
    expect(calc.getCallCount()).toBe(2);
  });

  test('应该正确处理字符串参数', () => {
    class StringProcessor {
      private callCount = 0;

      @Memorize
      processString(str: string): string {
        this.callCount++;
        return str.toUpperCase();
      }

      getCallCount(): number {
        return this.callCount;
      }
    }

    const processor = new StringProcessor();

    const result1 = processor.processString('hello');
    expect(result1).toBe('HELLO');
    expect(processor.getCallCount()).toBe(1);

    const result2 = processor.processString('hello');
    expect(result2).toBe('HELLO');
    expect(processor.getCallCount()).toBe(1);
  });

  test('应该正确处理多个参数', () => {
    class MathOperations {
      private callCount = 0;

      @Memorize
      add(a: number, b: number): number {
        this.callCount++;
        return a + b;
      }

      getCallCount(): number {
        return this.callCount;
      }
    }

    const math = new MathOperations();

    const result1 = math.add(2, 3);
    expect(result1).toBe(5);
    expect(math.getCallCount()).toBe(1);

    const result2 = math.add(2, 3);
    expect(result2).toBe(5);
    expect(math.getCallCount()).toBe(1);

    const result3 = math.add(4, 5);
    expect(result3).toBe(9);
    expect(math.getCallCount()).toBe(2);
  });

  test('应该正确处理对象参数', () => {
    class ObjectProcessor {
      private callCount = 0;

      @Memorize
      processObject(obj: { value: number }): number {
        this.callCount++;
        return obj.value * 2;
      }

      getCallCount(): number {
        return this.callCount;
      }
    }

    const processor = new ObjectProcessor();
    const obj = { value: 10 };

    const result1 = processor.processObject(obj);
    expect(result1).toBe(20);
    expect(processor.getCallCount()).toBe(1);

    const result2 = processor.processObject(obj);
    expect(result2).toBe(20);
    expect(processor.getCallCount()).toBe(1);

    // 不同引用的相同内容对象应该分别缓存
    const obj2 = { value: 10 };
    const result3 = processor.processObject(obj2);
    expect(result3).toBe(20);
    expect(processor.getCallCount()).toBe(2);
  });

  test('应该正确处理异步方法', async () => {
    class AsyncService {
      private callCount = 0;

      @Memorize
      async fetchData(id: number): Promise<string> {
        this.callCount++;
        await new Promise(resolve => setTimeout(resolve, 10));
        return `data-${id}`;
      }

      getCallCount(): number {
        return this.callCount;
      }
    }

    const service = new AsyncService();

    const result1 = await service.fetchData(1);
    expect(result1).toBe('data-1');
    expect(service.getCallCount()).toBe(1);

    const result2 = await service.fetchData(1);
    expect(result2).toBe('data-1');
    expect(service.getCallCount()).toBe(1);
  });

  test('应该正确处理返回对象的方法', () => {
    class DataService {
      private callCount = 0;

      @Memorize
      getData(id: number): { id: number; name: string } {
        this.callCount++;
        return { id, name: `Item ${id}` };
      }

      getCallCount(): number {
        return this.callCount;
      }
    }

    const service = new DataService();

    const result1 = service.getData(1);
    expect(result1).toEqual({ id: 1, name: 'Item 1' });
    expect(service.getCallCount()).toBe(1);

    const result2 = service.getData(1);
    expect(result2).toEqual({ id: 1, name: 'Item 1' });
    expect(result2).toBe(result1); // 应该返回相同的引用
    expect(service.getCallCount()).toBe(1);
  });

  test('应该正确处理 this 上下文', () => {
    class ContextTest {
      private value = 42;

      @Memorize
      getValue(): number {
        return this.value;
      }

      @Memorize
      multiply(factor: number): number {
        return this.value * factor;
      }
    }

    const instance = new ContextTest();

    const result1 = instance.getValue();
    expect(result1).toBe(42);

    const result2 = instance.multiply(2);
    expect(result2).toBe(84);

    // 第二次调用应该从缓存返回
    const result3 = instance.getValue();
    expect(result3).toBe(42);

    const result4 = instance.multiply(2);
    expect(result4).toBe(84);
  });

  test('应该正确处理错误情况', () => {
    class ErrorService {
      private callCount = 0;

      @Memorize
      mightThrow(shouldThrow: boolean): string {
        this.callCount++;
        if (shouldThrow) {
          throw new Error('Test error');
        }
        return 'success';
      }

      getCallCount(): number {
        return this.callCount;
      }
    }

    const service = new ErrorService();

    // 第一次调用应该抛出错误
    expect(() => service.mightThrow(true)).toThrow('Test error');
    expect(service.getCallCount()).toBe(1);

    // 第二次调用相同参数应该再次抛出错误（错误不会被缓存）
    expect(() => service.mightThrow(true)).toThrow('Test error');
    expect(service.getCallCount()).toBe(2);

    // 不同参数应该正常工作
    const result = service.mightThrow(false);
    expect(result).toBe('success');
    expect(service.getCallCount()).toBe(3);
  });

  test('应该正确处理 Symbol 属性名', () => {
    const SYMBOL_METHOD = Symbol('method');

    class SymbolTest {
      private callCount = 0;

      @Memorize
      [SYMBOL_METHOD](value: number): number {
        this.callCount++;
        return value * 2;
      }

      getCallCount(): number {
        return this.callCount;
      }
    }

    const instance = new SymbolTest();

    const result1 = instance[SYMBOL_METHOD](5);
    expect(result1).toBe(10);
    expect(instance.getCallCount()).toBe(1);

    const result2 = instance[SYMBOL_METHOD](5);
    expect(result2).toBe(10);
    expect(instance.getCallCount()).toBe(1);
  });

  test('应该正确处理继承', () => {
    class BaseClass {
      protected callCount = 0;

      @Memorize
      baseMethod(value: number): number {
        this.callCount++;
        return value * 2;
      }

      getCallCount(): number {
        return this.callCount;
      }
    }

    class DerivedClass extends BaseClass {
      @Memorize
      derivedMethod(value: number): number {
        this.callCount++;
        return value * 3;
      }
    }

    const instance = new DerivedClass();

    // 测试基类方法
    const result1 = instance.baseMethod(5);
    expect(result1).toBe(10);
    expect(instance.getCallCount()).toBe(1);

    const result2 = instance.baseMethod(5);
    expect(result2).toBe(10);
    expect(instance.getCallCount()).toBe(1);

    // 测试派生类方法
    const result3 = instance.derivedMethod(4);
    expect(result3).toBe(12);
    expect(instance.getCallCount()).toBe(2);

    const result4 = instance.derivedMethod(4);
    expect(result4).toBe(12);
    expect(instance.getCallCount()).toBe(2);
  });

  test('应该正确处理静态方法', () => {
    class StaticTest {
      private static callCount = 0;

      @Memorize
      static staticMethod(value: number): number {
        StaticTest.callCount++;
        return value * 2;
      }

      static getCallCount(): number {
        return StaticTest.callCount;
      }
    }

    const result1 = StaticTest.staticMethod(5);
    expect(result1).toBe(10);
    expect(StaticTest.getCallCount()).toBe(1);

    const result2 = StaticTest.staticMethod(5);
    expect(result2).toBe(10);
    expect(StaticTest.getCallCount()).toBe(1);
  });

  test('应该正确处理复杂参数类型', () => {
    class ComplexService {
      private callCount = 0;

      @Memorize
      processComplex(
        arr: number[],
        obj: { key: string },
        fn: (x: number) => number
      ): any {
        this.callCount++;
        return {
          arraySum: arr.reduce((sum, n) => sum + n, 0),
          objectKey: obj.key,
          functionResult: fn(5)
        };
      }

      getCallCount(): number {
        return this.callCount;
      }
    }

    const service = new ComplexService();
    const arr = [1, 2, 3];
    const obj = { key: 'test' };
    const fn = (x: number) => x * 2;

    const result1 = service.processComplex(arr, obj, fn);
    expect(result1).toEqual({
      arraySum: 6,
      objectKey: 'test',
      functionResult: 10
    });
    expect(service.getCallCount()).toBe(1);

    const result2 = service.processComplex(arr, obj, fn);
    expect(result2).toEqual(result1);
    expect(service.getCallCount()).toBe(1);
  });

  test('应该正确处理装饰器错误情况', () => {
    // 装饰器应该抛出错误
    expect(() => {
      class InvalidTest {
        // 尝试装饰非方法属性
        @Memorize
        notAMethod: string = 'not a method';
      }
    }).toThrow('Memorize decorator can only be applied to methods');
  });

  test('应该正确处理多个装饰器方法', () => {
    class MultiMethodTest {
      private callCount1 = 0;
      private callCount2 = 0;

      @Memorize
      method1(value: number): number {
        this.callCount1++;
        return value * 2;
      }

      @Memorize
      method2(value: string): string {
        this.callCount2++;
        return value.toUpperCase();
      }

      getCallCounts(): { count1: number; count2: number } {
        return { count1: this.callCount1, count2: this.callCount2 };
      }
    }

    const instance = new MultiMethodTest();

    // 测试第一个方法
    const result1 = instance.method1(5);
    expect(result1).toBe(10);
    expect(instance.getCallCounts()).toEqual({ count1: 1, count2: 0 });

    const result2 = instance.method1(5);
    expect(result2).toBe(10);
    expect(instance.getCallCounts()).toEqual({ count1: 1, count2: 0 });

    // 测试第二个方法
    const result3 = instance.method2('hello');
    expect(result3).toBe('HELLO');
    expect(instance.getCallCounts()).toEqual({ count1: 1, count2: 1 });

    const result4 = instance.method2('hello');
    expect(result4).toBe('HELLO');
    expect(instance.getCallCounts()).toEqual({ count1: 1, count2: 1 });
  });
});
