# Decimal

A class for handling high-precision decimal arithmetic operations. Supports arbitrary precision addition, subtraction, multiplication, and division operations, avoiding floating-point precision issues in JavaScript.

## Class

### Decimal

Represents a high-precision decimal number class.

#### Constructor

```typescript
new Decimal(value: string | number | Decimal = '0', precision: number = 10)
```

**Parameters:**

- `value: string | number | Decimal` - Initial value, can be a string, number, or another Decimal object (default is '0')
- `precision: number` - Precision, the number of decimal places to retain (default is 10)

#### Properties

##### ZERO (static)

Static property representing a Decimal instance with value 0.

```typescript
static ZERO = new Decimal('0')
```

##### value (getter)

Get the internal string representation of the Decimal object.

```typescript
get value(): string
```

**Returns:**

- `string` - The string value of the Decimal object

#### Methods

##### toString

Converts the Decimal object to a standard decimal number string representation.

```typescript
public toString(): string
```

**Returns:**

- `string` - Standard decimal number string (including decimal point)

##### add

Performs addition operation with another Decimal object.

```typescript
public add(o: Decimal): Decimal
```

**Parameters:**

- `o: Decimal` - The Decimal object to add

**Returns:**

- [Decimal](file://e:\code\myProject\js-utils\src\data_structure\Decimal.ts#L12-L209) - Returns the Decimal result after addition operation

##### sub

Performs subtraction operation with another Decimal object.

```typescript
public sub(o: Decimal): Decimal
```

**Parameters:**

- `o: Decimal` - The Decimal object to subtract

**Returns:**

- [Decimal](file://e:\code\myProject\js-utils\src\data_structure\Decimal.ts#L12-L209) - Returns the Decimal result after subtraction operation

##### mul

Performs multiplication operation with another Decimal object.

```typescript
public mul(o: Decimal): Decimal
```

**Parameters:**

- `o: Decimal` - The Decimal object to multiply

**Returns:**

- [Decimal](file://e:\code\myProject\js-utils\src\data_structure\Decimal.ts#L12-L209) - Returns the Decimal result after multiplication operation

##### div

Performs division operation with another Decimal object.

```typescript
public div(o: Decimal): Decimal
```

**Parameters:**

- `o: Decimal` - The Decimal object to divide by

**Returns:**

- [Decimal](file://e:\code\myProject\js-utils\src\data_structure\Decimal.ts#L12-L209) - Returns the Decimal result after division operation

#### Examples

```typescript
// Assuming Decimal is imported

// 1. Basic usage
const a = new Decimal('0.1');
const b = new Decimal('0.2');
const result = a.add(b);
console.log(result.toString()); // Output: "0.3"

// 2. High-precision calculation
const c = new Decimal('123.456789');
const d = new Decimal('987.654321');
const product = c.mul(d);
console.log(product.toString()); // Output high-precision multiplication result

// 3. Chained operations
const e = new Decimal('100');
const f = new Decimal('50');
const g = new Decimal('10');
const chainedResult = e.add(f).sub(g); // (100 + 50) - 10 = 140
console.log(chainedResult.toString());
```