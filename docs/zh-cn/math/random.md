# random

## 函数 - genRandomInt

生成一个闭区间内的整数

### 参数

- `min`: `number` - 最小值（包含）

- `max`: `number` - 最大值（包含）

### 返回值

`number`-随机整数

### 示例
```typescript
import { genRandomInt } from '@lengineerc/utils';

// 生成 1-10 之间的随机整数
console.log(genRandomInt(1, 10)); // 可能是 1, 2, 3, ..., 10 中的任意一个

// 生成 0-100 之间的随机整数
console.log(genRandomInt(0, 100)); // 可能是 0, 1, 2, ..., 100 中的任意一个

// 边界情况
console.log(genRandomInt(5, 5)); // 5
```
## 函数 - genRandomFloat

生成一个闭区间内的浮点数

### 参数

- `min`: `number` - 最小值（包含，默认0）

- `max`: `number` - 最大值（包含，默认1）

- `precision`: `number` - 精度（默认1位小数）

### 返回值

`number`-随机浮点数

### 示例
```typescript
import { genRandomFloat } from '@lengineerc/utils';

// 生成 0-1 之间的随机浮点数（1位小数）
console.log(genRandomFloat()); // 可能是 0.1, 0.5, 0.9 等

// 生成 1-10 之间的随机浮点数（2位小数）
console.log(genRandomFloat(1, 10, 2)); // 可能是 1.23, 5.67, 9.99 等

// 生成整数（精度为0）
console.log(genRandomFloat(1, 10, 0)); // 可能是 1, 2, 3, ..., 10

// 高精度浮点数
console.log(genRandomFloat(0, 1, 5)); // 可能是 0.12345, 0.67890 等
```
## 函数 - genRandomBoolean

生成随机布尔值

### 参数

- `probability`: `number` - 生成为true的概率（默认0.5）

### 返回值

`boolean`-随机布尔值

### 示例
```typescript
import { genRandomBoolean } from '@lengineerc/utils';

// 50% 概率生成 true
console.log(genRandomBoolean()); // true 或 false

// 80% 概率生成 true
console.log(genRandomBoolean(0.8)); // 更可能是 true

// 20% 概率生成 true
console.log(genRandomBoolean(0.2)); // 更可能是 false

// 边界情况
console.log(genRandomBoolean(0)); // false
console.log(genRandomBoolean(1)); // true
```
