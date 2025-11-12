# flat

## Function - flat

Flatten an array

### Parameters

- `arr`: `any[]` - The array to flatten

- `depth`: `number` - Flattening depth, defaults to flattening all levels

### Return Value

`any[]` - The flattened array

### Examples

## Examples

```typescript
import { flat } from '@lengineerc/utils';

// Basic usage
const arr = [1, [2, 3], [4, [5, 6]]];
console.log(flat(arr)); // [1, 2, 3, 4, 5, 6]

// Specify flattening depth
const arr2 = [1, [2, [3, [4]]]];
console.log(flat(arr2, 2)); // [1, 2, 3, [4]]

// Empty array
console.log(flat([])); // []

// Depth of 0
console.log(flat([1, [2, 3]], 0)); // [1, [2, 3]]
```

## Features

- Uses stack structure implementation to avoid recursive call stack overflow

