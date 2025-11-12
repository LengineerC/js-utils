# range

## Function - range

Generate an array containing numbers in the specified range, similar to Python.

### Parameters

- `start`: `number` - Starting value (inclusive). If only one parameter is provided, it is treated as end, and start defaults to 0.

- `end`: `number` - Ending value (exclusive).

- `step`: `number` - Step size, defaults to 1. Can be negative.

### Return Value

`number[]` - Array containing the number sequence.

### Examples
```ts
range(5)  // [0, 1, 2, 3, 4]
range(2, 10, 2)  // [2, 4, 6, 8]
range(5, 0, -1)  // [5, 4, 3, 2, 1]
```

### ⚠️ Warning
- Using floating-point step sizes will have precision issues, it's best to only use integers

