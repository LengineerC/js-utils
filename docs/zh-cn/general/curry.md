# curry

## 函数 - curry

柯里化函数，将多参数函数转换为可部分应用的函数。

### 参数

- `fn`: `(...args: any[]) => any` - 需要柯里化的函数

### 返回值

返回柯里化后的函数

### 示例

```typescript
import { curry } from '@lengineerc/utils';

// 基本用法
const add = (a: number, b: number) => a + b;
const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)); // 3
console.log(curriedAdd(1, 2)); // 3

// 三参数函数
const multiply = (a: number, b: number, c: number) => a * b * c;
const curriedMultiply = curry(multiply);

console.log(curriedMultiply(2)(3)(4)); // 24
console.log(curriedMultiply(2, 3)(4)); // 24
console.log(curriedMultiply(2)(3, 4)); // 24

// 部分应用
const multiplyBy2 = curriedMultiply(2);
const multiplyBy2And3 = multiplyBy2(3);
console.log(multiplyBy2And3(4)); // 24

// 保持 this 上下文
const obj = {
  value: 10,
  add: function(a: number, b: number) {
    return this.value + a + b;
  }
};

const curriedMethod = curry(obj.add);
console.log(curriedMethod.call(obj, 1)(2)); // 13
```

## 特性

- 支持任意参数数量的函数