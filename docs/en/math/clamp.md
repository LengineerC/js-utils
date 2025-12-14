# clamp

## Function - clamp

Clamps a number within the inclusive lower and upper bounds.

### Parameters

- `value`: `number` - The number to clamp.
- `min`: `number` - The lower bound.
- `max`: `number` - The upper bound.

### Return Value

`number` - The clamped number.
- Returns `min` if `value` < `min`.
- Returns `max` if `value` > `max`.
- Returns `value` if it is within the range.

### Examples

## Examples

```typescript
import { clamp } from '@lengineerc/utils';

// 1. Value is within the range
console.log(clamp(7, 0, 10)); 
// Output: 7

// 2. Value is smaller than min
console.log(clamp(-5, 0, 10)); 
// Output: 0

// 3. Value is larger than max
console.log(clamp(20, 0, 10)); 
// Output: 10

// 4. Floating point numbers
console.log(clamp(1.5, 2.0, 3.0)); 
// Output: 2.0
```

