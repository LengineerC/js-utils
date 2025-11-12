# cloneDeep

## Function - cloneDeep

Implementation based on lodash, cannot deep clone functions, returns original function reference

### Parameters

- `value`: `any` - The value to deep clone

### Return Value

The deep cloned value

### Examples

```typescript
import { cloneDeep } from '@lengineerc/utils';

// Primitive types
console.log(cloneDeep(42)); // 42
console.log(cloneDeep('hello')); // 'hello'
console.log(cloneDeep(true)); // true

// Arrays
const arr = [1, [2, 3], { a: 4 }];
const clonedArr = cloneDeep(arr);
console.log(clonedArr); // [1, [2, 3], { a: 4 }]
console.log(clonedArr !== arr); // true

// Objects
const obj = { a: 1, b: { c: 2 } };
const clonedObj = cloneDeep(obj);
console.log(clonedObj); // { a: 1, b: { c: 2 } }
console.log(clonedObj !== obj); // true

// Circular references
const circular: any = { a: 1 };
circular.self = circular;
const clonedCircular = cloneDeep(circular);
console.log(clonedCircular.self === clonedCircular); // true

// Special objects
const date = new Date();
const clonedDate = cloneDeep(date);
console.log(clonedDate instanceof Date); // true

const regex = /test/gi;
const clonedRegex = cloneDeep(regex);
console.log(clonedRegex instanceof RegExp); // true
```

## Supported Data Types

- Primitive types: `number`, `string`, `boolean`, `null`, `undefined`
- Arrays and objects
- Special objects: `Date`, `RegExp`, `Map`, `Set`, `ArrayBuffer`, `TypedArray`
- Error objects: `Error` and its subclasses
- Functions (shallow copy)
- `Symbol` and `BigInt`
- Circular references

## Features

- Based on lodash implementation

