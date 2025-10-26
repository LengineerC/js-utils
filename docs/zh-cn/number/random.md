# random

随机数生成工具集，提供多种类型的随机数生成功能。

## 函数列表

### genRandomInt

生成指定范围内的随机整数。

#### 语法

```typescript
genRandomInt(min: number, max: number): number
```

#### 参数

- `min` - 最小值（包含）
- `max` - 最大值（包含）

#### 返回值

返回指定范围内的随机整数。

#### 示例

```typescript
import { genRandomInt } from '@lengineerc/utils';

// 生成 1-10 之间的随机整数
console.log(genRandomInt(1, 10)); // 可能是 1, 2, 3, ..., 10 中的任意一个

// 生成 0-100 之间的随机整数
console.log(genRandomInt(0, 100)); // 可能是 0, 1, 2, ..., 100 中的任意一个

// 边界情况
console.log(genRandomInt(5, 5)); // 5
```

#### 错误处理

```typescript
// 最小值大于最大值
genRandomInt(10, 5); // 抛出错误: 最小值不能大于最大值

// 非有限数字
genRandomInt(Infinity, 10); // 抛出错误: 最小值必须是有限数字
genRandomInt(1, NaN); // 抛出错误: 最大值必须是有限数字
```

### genRandomFloat

生成指定范围内的随机浮点数。

#### 语法

```typescript
genRandomFloat(min: number = 0, max: number = 1, precision: number = 1): number
```

#### 参数

- `min` - 最小值（包含），默认 0
- `max` - 最大值（包含），默认 1
- `precision` - 精度（小数位数），默认 1

#### 返回值

返回指定范围内的随机浮点数。

#### 示例

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

### genRandomBoolean

生成随机布尔值。

#### 语法

```typescript
genRandomBoolean(probability: number = 0.5): boolean
```

#### 参数

- `probability` - 生成为 `true` 的概率，默认 0.5

#### 返回值

返回随机布尔值。

#### 示例

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

#### 错误处理

```typescript
// 概率超出范围
genRandomBoolean(1.5); // 抛出错误: 概率必须在 0-1 之间
genRandomBoolean(-0.1); // 抛出错误: 概率必须在 0-1 之间

// 非数字类型
genRandomBoolean('0.5'); // 抛出错误: 概率必须是有限数字
```

## 特性

- 类型安全，支持 TypeScript
- 完整的错误处理和参数验证
- 支持边界情况处理
- 可配置的精度控制
- 清晰的 API 设计
