# Option

## Class - Option

Option type, representing an optional value that may be either a value (Some) or empty (None).

### Type Parameters

- `T` - The type of value contained in Some

### Static Methods

#### Some

Creates an Option containing a value.

```typescript
static Some<T>(value: T): Option<T>
```

**Parameters**

- `value`: `T` - The value to wrap

**Returns**

Returns an Option containing the value

#### None

Creates an empty Option.

```typescript
static None<T = never>(): Option<T>
```

**Returns**

Returns an empty Option

#### from

Creates an Option from a value, returns None if value is null or undefined, otherwise returns Some.

```typescript
static from<T>(value: T | undefined | null): Option<T>
```

**Parameters**

- `value`: `T | undefined | null` - The value to convert

**Returns**

Returns Some if value is not null or undefined, otherwise returns None

### Instance Methods

#### isSome

Checks if it's Some (has a value).

```typescript
isSome(): boolean
```

**Returns**

Returns true if contains a value, otherwise returns false

#### isNone

Checks if it's None (no value).

```typescript
isNone(): boolean
```

**Returns**

Returns true if None, otherwise returns false

#### map

If Some, transforms the inner value using the function; if None, returns None.

```typescript
map<U>(fn: (val: T) => U): Option<U>
```

**Parameters**

- `fn`: `(val: T) => U` - The transformation function

**Returns**

Returns the transformed Option

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

Gets the inner value, returns default value if None.

```typescript
unwrapOr(defaultValue: T): T
```

**Parameters**

- `defaultValue`: `T` - The default value

**Returns**

Returns the inner value or the default value

### Examples

```typescript
import { Option } from '@lengineerc/utils';

// Creating Option
const someValue = Option.Some(42);
const noneValue = Option.None();
const fromValue = Option.from(42);
const fromNull = Option.from(null);

// Check value
console.log(someValue.isSome()); // true
console.log(someValue.isNone()); // false

// Map
const mapped = Option.Some(5).map(x => x * 2);
console.log(mapped.unwrap()); // 10

// Unwrap
console.log(Option.Some(10).unwrap()); // 10
console.log(Option.None().unwrapOr(0)); // 0
```

## Features

- Type-safe way to handle optional values
- Inspired by Rust's Option type
- Provides methods for transforming and extracting values
- Supports null and undefined as "None" values
