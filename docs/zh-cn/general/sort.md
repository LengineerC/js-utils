# sort

版本号比较函数，支持语义化版本号和预发布版本。

## 语法

```typescript
compareVersion(a: string, b: string): number
```

## 参数

- `a` - 版本号 a
- `b` - 版本号 b

## 返回值

- `0` - 版本号相等
- `1` - 版本号 a 大于 b
- `-1` - 版本号 a 小于 b

## 示例

```typescript
import { compareVersion } from '@lengineerc/utils';

// 基本版本号比较
console.log(compareVersion('1.0.0', '1.0.1')); // -1
console.log(compareVersion('1.0.1', '1.0.0')); // 1
console.log(compareVersion('1.0.0', '1.0.0')); // 0

// 不同长度的版本号
console.log(compareVersion('1.0', '1.0.0')); // 0
console.log(compareVersion('1.0.0', '1.0')); // 0

// 预发布版本
console.log(compareVersion('1.0.0', '1.0.0-alpha')); // 1
console.log(compareVersion('1.0.0-alpha', '1.0.0')); // -1
console.log(compareVersion('1.0.0-alpha', '1.0.0-beta')); // -1

// 用于数组排序
const versions = ['1.0.0', '2.0.0', '1.0.0-alpha', '1.0.1', '1.0.0-beta'];
versions.sort(compareVersion);
console.log(versions); // ['1.0.0-alpha', '1.0.0-beta', '1.0.0', '1.0.1', '2.0.0']
```

## 支持的版本格式

- 标准语义化版本：`1.0.0`、`2.1.3`
- 预发布版本：`1.0.0-alpha`、`1.0.0-beta.1`、`1.0.0-rc.1`
- 不同长度版本：`1.0`、`1.0.0`、`1.0.0.0`

## 比较规则

1. 按数字部分逐级比较（主版本号、次版本号、修订号）
2. 缺失的版本号部分视为 0
3. 正式版本大于预发布版本
4. 预发布版本按字母顺序比较

## 特性

- 支持语义化版本规范
- 支持预发布版本标签
- 可用于 `Array.prototype.sort` 方法
- 处理不同长度的版本号
