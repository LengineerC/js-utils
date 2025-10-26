# cloneDeep

深拷贝函数，支持各种数据类型和循环引用。

## 语法

```typescript
cloneDeep<T>(value: T): T
```

## 参数

- `value` - 需要被深拷贝的值

## 返回值

返回深拷贝后的值，类型与输入值相同。

## 示例

```typescript
import { cloneDeep } from '@lengineerc/utils';

// 基本类型
console.log(cloneDeep(42)); // 42
console.log(cloneDeep('hello')); // 'hello'
console.log(cloneDeep(true)); // true

// 数组
const arr = [1, [2, 3], { a: 4 }];
const clonedArr = cloneDeep(arr);
console.log(clonedArr); // [1, [2, 3], { a: 4 }]
console.log(clonedArr !== arr); // true

// 对象
const obj = { a: 1, b: { c: 2 } };
const clonedObj = cloneDeep(obj);
console.log(clonedObj); // { a: 1, b: { c: 2 } }
console.log(clonedObj !== obj); // true

// 循环引用
const circular: any = { a: 1 };
circular.self = circular;
const clonedCircular = cloneDeep(circular);
console.log(clonedCircular.self === clonedCircular); // true

// 特殊对象
const date = new Date();
const clonedDate = cloneDeep(date);
console.log(clonedDate instanceof Date); // true

const regex = /test/gi;
const clonedRegex = cloneDeep(regex);
console.log(clonedRegex instanceof RegExp); // true
```

## 支持的数据类型

- 基本类型：`number`、`string`、`boolean`、`null`、`undefined`
- 数组和对象
- 特殊对象：`Date`、`RegExp`、`Map`、`Set`、`ArrayBuffer`、`TypedArray`
- 错误对象：`Error` 及其子类
- 函数（浅拷贝）
- `Symbol` 和 `BigInt`
- 循环引用

## 特性

- 基于 lodash 实现
- 支持循环引用检测
- 保持原型链
- 处理各种边界情况
- 类型安全
