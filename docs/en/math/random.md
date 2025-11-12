# random

## Function - genRandomInt

Generate a random integer in a closed interval

### Parameters

- `min`: `number` - Minimum value (inclusive)

- `max`: `number` - Maximum value (inclusive)

### Return Value

`number` - Random integer

### Examples
```typescript
import { genRandomInt } from '@lengineerc/utils';

// Generate random integer between 1-10
console.log(genRandomInt(1, 10)); // Could be any of 1, 2, 3, ..., 10

// Generate random integer between 0-100
console.log(genRandomInt(0, 100)); // Could be any of 0, 1, 2, ..., 100

// Edge cases
console.log(genRandomInt(5, 5)); // 5
```
## Function - genRandomFloat

Generate a random float in a closed interval

### Parameters

- `min`: `number` - Minimum value (inclusive, default 0)

- `max`: `number` - Maximum value (inclusive, default 1)

- `precision`: `number` - Precision (default 1 decimal place)

### Return Value

`number` - Random float

### Examples
```typescript
import { genRandomFloat } from '@lengineerc/utils';

// Generate random float between 0-1 (1 decimal place)
console.log(genRandomFloat()); // Could be 0.1, 0.5, 0.9, etc.

// Generate random float between 1-10 (2 decimal places)
console.log(genRandomFloat(1, 10, 2)); // Could be 1.23, 5.67, 9.99, etc.

// Generate integer (precision 0)
console.log(genRandomFloat(1, 10, 0)); // Could be 1, 2, 3, ..., 10

// High precision float
console.log(genRandomFloat(0, 1, 5)); // Could be 0.12345, 0.67890, etc.
```
## Function - genRandomBoolean

Generate a random boolean value

### Parameters

- `probability`: `number` - Probability of generating true (default 0.5)

### Return Value

`boolean` - Random boolean value

### Examples
```typescript
import { genRandomBoolean } from '@lengineerc/utils';

// 50% probability of generating true
console.log(genRandomBoolean()); // true or false

// 80% probability of generating true
console.log(genRandomBoolean(0.8)); // More likely to be true

// 20% probability of generating true
console.log(genRandomBoolean(0.2)); // More likely to be false

// Edge cases
console.log(genRandomBoolean(0)); // false
console.log(genRandomBoolean(1)); // true
```

