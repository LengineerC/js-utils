# memorize

## 函数 - memorize

缓存函数

### 参数

- `fn`: `(...args: any[]) => any` - 需要被缓存的函数

### 返回值

缓存后的函数

### 示例
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
## 函数 - Memorize

函数缓存装饰器（通过@装饰器语法调用）

### 参数

### 示例
```typescript
import { Memorize } from '@lengineerc/utils';

class Calculator {
  private callCount = 0;

  @Memorize
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