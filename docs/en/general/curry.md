# curry

## Function - curry

Curry function, converts a multi-parameter function into a partially applicable function.

### Parameters

- `fn`: `(...args: any[]) => any` - The function to curry

### Return Value

Returns the curried function

### Examples

```typescript
import { curry } from '@lengineerc/utils';

// Basic usage
const add = (a: number, b: number) => a + b;
const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)); // 3
console.log(curriedAdd(1, 2)); // 3

// Three-parameter function
const multiply = (a: number, b: number, c: number) => a * b * c;
const curriedMultiply = curry(multiply);

console.log(curriedMultiply(2)(3)(4)); // 24
console.log(curriedMultiply(2, 3)(4)); // 24
console.log(curriedMultiply(2)(3, 4)); // 24

// Partial application
const multiplyBy2 = curriedMultiply(2);
const multiplyBy2And3 = multiplyBy2(3);
console.log(multiplyBy2And3(4)); // 24

// Preserve this context
const obj = {
  value: 10,
  add: function(a: number, b: number) {
    return this.value + a + b;
  }
};

const curriedMethod = curry(obj.add);
console.log(curriedMethod.call(obj, 1)(2)); // 13
```

## Features

- Supports functions with any number of parameters

