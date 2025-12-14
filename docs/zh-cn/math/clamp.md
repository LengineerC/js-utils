# clamp

## Function - clamp

将数值限制在指定的闭区间 `[min, max]` 内。

### Parameters

- `value`: `number` - 需要限制的数值。
- `min`: `number` - 允许的最小值（下限）。
- `max`: `number` - 允许的最大值（上限）。

### Return Value

`number` - 限制后的数值。
- 如果 `value` 小于 `min`，返回 `min`。
- 如果 `value` 大于 `max`，返回 `max`。
- 如果 `value` 在区间内，返回原值。

### Examples

## Examples

```typescript
import { clamp } from '@lengineerc/utils';

// 1. 数值在区间内
console.log(clamp(7, 0, 10)); 
// 输出: 7

// 2. 数值小于最小值
console.log(clamp(-5, 0, 10)); 
// 输出: 0

// 3. 数值大于最大值
console.log(clamp(20, 0, 10)); 
// 输出: 10

// 4. 浮点数处理
console.log(clamp(1.5, 2.0, 3.0)); 
// 输出: 2.0
```

