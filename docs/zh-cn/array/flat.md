# flat

数组展平函数，支持指定展平深度。

## 语法

```typescript
flat(arr: any[], depth: number = Infinity): any[]
```

## 参数

- `arr` - 需要展平的数组
- `depth` - 展平深度，默认为 `Infinity`（全部展平）

## 返回值

返回展平后的数组。

## 示例

```typescript
import { flat } from '@lengineerc/utils';

// 基本用法
const arr = [1, [2, 3], [4, [5, 6]]];
console.log(flat(arr)); // [1, 2, 3, 4, 5, 6]

// 指定展平深度
const arr2 = [1, [2, [3, [4]]]];
console.log(flat(arr2, 2)); // [1, 2, 3, [4]]

// 空数组
console.log(flat([])); // []

// 深度为0
console.log(flat([1, [2, 3]], 0)); // [1, [2, 3]]
```

## 特性

- 使用栈结构实现，避免递归调用栈溢出
- 支持任意深度的嵌套数组
- 保持原始数组不变
- 处理空数组和边界情况
