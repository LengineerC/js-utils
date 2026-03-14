# Result

## Class - Result

Result type, representing the result of an operation that may be either success (Ok) or failure (Err).

### Type Parameters

- `T` - The type of value contained in Ok
- `E` - The type of value contained in Err

### Static Methods

#### Ok

Creates a successful Result.

```typescript
static Ok<T, E = never>(val: T): Result<T, E>
```

**Parameters**

- `val`: `T` - The success value

**Returns**

Returns a successful Result

#### Err

Creates an error Result.

```typescript
static Err<E, T = never>(err: E): Result<T, E>
```

**Parameters**

- `err`: `E` - The error value

**Returns**

Returns an error Result

#### fromThrowable

Wraps a function that may throw exceptions into a Result type.

```typescript
static fromThrowable<T, E = Error>(fn: () => T): Result<T, E>
```

**Parameters**

- `fn`: `() => T` - The function that may throw

**Returns**

Returns Ok on success, Err on exception

### Instance Methods

#### isOk

Checks if it's a successful result.

```typescript
isOk(): boolean
```

**Returns**

Returns true if successful, otherwise returns false

#### isErr

Checks if it's an error result.

```typescript
isErr(): boolean
```

**Returns**

Returns true if error, otherwise returns false

#### map

If Ok, transforms the inner value using the function; if Err, returns Err.

```typescript
map<U>(fn: (val: T) => U): Result<U, E>
```

**Parameters**

- `fn`: `(val: T) => U` - The transformation function

**Returns**

Returns the transformed Result

#### andThen

Chain calls, if Ok executes the function and returns a new Result, if Err returns Err.

```typescript
andThen<U>(fn: (val: T) => Result<U, E>): Result<U, E>
```

**Parameters**

- `fn`: `(val: T) => Result<U, E>` - Function that returns Result

**Returns**

Returns the chained Result

#### unwrap

Gets the inner value, throws error if None.

```typescript
unwrap(): T
```

**Returns**

Returns the inner value

**Throws**

Throws an error if the value is None

#### unwrapOr

Gets the inner value, returns default value if Err.

```typescript
unwrapOr(defaultValue: T): T
```

**Parameters**

- `defaultValue`: `T` - The default value

**Returns**

Returns the success value or the default value

#### match

Pattern matching, executes the corresponding function based on Ok or Err.

```typescript
match<U>(cases: { Ok: (val: T) => U; Err: (err: E) => U }): U
```

**Parameters**

- `cases`: `{ Ok: (val: T) => U; Err: (err: E) => U }` - Object containing Ok and Err handlers

**Returns**

Returns the value from the corresponding branch

### Examples

```typescript
import { Result } from '@lengineerc/utils';

// Creating Result
const okResult = Result.Ok(42);
const errResult = Result.Err('error message');

// Check result
console.log(okResult.isOk()); // true
console.log(okResult.isErr()); // false

// Map
const mapped = Result.Ok(5).map(x => x * 2);
console.log(mapped.unwrap()); // 10

// andThen
const chained = Result.Ok(5).andThen(x => Result.Ok(x * 2));
console.log(chained.unwrap()); // 10

// unwrapOr
console.log(Result.Ok(10).unwrapOr(0)); // 10
console.log(Result.Err('error').unwrapOr(0)); // 0

// match
const result = Result.Ok(42);
const message = result.match({
  Ok: val => `Success: ${val}`,
  Err: err => `Error: ${err}`
});
console.log(message); // Success: 42

// fromThrowable
const safeDivide = (a: number, b: number) => {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
};

const safeResult = Result.fromThrowable(() => safeDivide(10, 0));
console.log(safeResult.isErr()); // true
```

## Features

- Type-safe way to handle operation results
- Inspired by Rust's Result type
- Provides methods for transforming and chaining operations
- Supports exception handling via fromThrowable
- Pattern matching with match method
