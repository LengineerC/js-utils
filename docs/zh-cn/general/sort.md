# sort

## 函数 - compareVersion

版本号比较，可直接用于两个版本好相比，也可以通过Array.prototype.sort调用，使版本号从小到大排序，支持1.0.0和包含使用-连接的预发布版本标签1.0.0-alpha

### 参数

- `a`: `string` - 版本a

- `b`: `string` - 版本b

### 返回值

`number` - 0相等，1: a>b，-1: b<a

### 示例

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