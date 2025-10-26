# memorize

函数缓存工具，自动缓存函数执行结果以提高性能。

## 函数

### memorize

缓存函数实现。

#### 语法

```typescript
memorize<T extends (...args: any[]) => any>(fn: T): T
```

#### 参数

- `fn` - 需要被缓存的函数

#### 返回值

返回缓存后的函数，类型与原始函数相同。

#### 示例

```typescript
import { memorize } from '@lengineerc/utils';

// 基本用法
const expensiveCalculation = (n: number) => {
  console.log('计算中...');
  return n * n * n;
};

const memoizedCalc = memorize(expensiveCalculation);

console.log(memoizedCalc(5)); // 计算中... 125
console.log(memoizedCalc(5)); // 125 (从缓存返回)
console.log(memoizedCalc(3)); // 计算中... 27

// 异步函数
const fetchData = async (id: number) => {
  console.log('获取数据...');
  return `data-${id}`;
};

const memoizedFetch = memorize(fetchData);

console.log(await memoizedFetch(1)); // 获取数据... data-1
console.log(await memoizedFetch(1)); // data-1 (从缓存返回)

// 对象参数（基于引用比较）
const processObject = (obj: { value: number }) => {
  console.log('处理对象...');
  return obj.value * 2;
};

const memoizedProcess = memorize(processObject);
const obj = { value: 10 };

console.log(memoizedProcess(obj)); // 处理对象... 20
console.log(memoizedProcess(obj)); // 20 (从缓存返回)
```

### memorized

缓存装饰器，用于类方法。

#### 语法

```typescript
memorized(
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): void
```

#### 示例

```typescript
import { memorized } from '@lengineerc/utils';

class Calculator {
  private callCount = 0;

  @memorized
  expensiveCalculation(n: number): number {
    this.callCount++;
    console.log(`计算 ${n}，调用次数: ${this.callCount}`);
    return n * n * n;
  }

  getCallCount(): number {
    return this.callCount;
  }
}

const calc = new Calculator();

console.log(calc.expensiveCalculation(5)); // 计算 5，调用次数: 1
console.log(calc.expensiveCalculation(5)); // 125 (从缓存返回)
console.log(calc.getCallCount()); // 1 (实际只计算了一次)
```

## 特性

- 基于参数引用比较的缓存策略
- 支持任意类型的参数
- 保持 `this` 上下文
- 支持异步函数
- 支持装饰器语法
- 类型安全
- 自动内存管理
