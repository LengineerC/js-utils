# matrix

A class for handling matrix operations, supporting basic arithmetic operations, transpose, determinant, inverse matrix, and other advanced features, with consideration for floating-point precision.

## Classes

### Matrix

Matrix class for representing and manipulating two-dimensional numeric matrices.

#### Constructor

```typescript
new Matrix(rows: number, cols: number, defaultValue: number = 0)
```

**Description:**
Initialize a matrix with specified number of rows and columns, filled with default values.

**Parameters:**

  - `rows` - **Number of rows**.
  - `cols` - **Number of columns**.
  - `defaultValue` - Default fill value (defaults to `0`).

**Throws:**

  - `Error` - If `rows` or `cols` is less than or equal to `0`.

#### Member Properties

  * `rows`: **number** - Number of rows in the matrix.
  * `cols`: **number** - Number of columns in the matrix.

#### Static Methods

##### fromArray

Build a matrix from a two-dimensional array.

```typescript
static fromArray(arr: number[][]): Matrix
```

**Parameters:**

  - `arr` - Two-dimensional numeric array for building the matrix.

**Return Value:**

  - **Matrix** - The constructed matrix instance.

**Throws:**

  - `Error` - If the array is not rectangular (i.e., rows have inconsistent lengths).

##### identity

Get an identity matrix (square matrix) of specified size.

```typescript
static identity(size: number): Matrix
```

**Parameters:**

  - `size` - Number of rows and columns (i.e., the order of the square matrix).

**Return Value:**

  - **Matrix** - The identity matrix $\text{I}$.

#### Member Methods

##### get

Get the element value at the specified position.

```typescript
get(row: number, col: number): number
```

**Parameters:**

  - `row` - Row index.
  - `col` - Column index.

**Return Value:**

  - **number** - Element value.

##### set

Set the element value at the specified position.

```typescript
set(row: number, col: number, value: number): void
```

**Parameters:**

  - `row` - Row index.
  - `col` - Column index.
  - `value` - Element value.

##### transpose

Transpose the matrix.

```typescript
transpose(): Matrix
```

**Return Value:**

  - **Matrix** - The new transposed matrix $\text{A}^{\text{T}}$.

##### add

Matrix addition.

```typescript
add(other: Matrix): Matrix
```

**Parameters:**

  - `other` - Another matrix to add.

**Return Value:**

  - **Matrix** - The new matrix after addition $\text{A} + \text{B}$.

**Throws:**

  - `Error` - If the two matrices have mismatched dimensions.

##### subtract

Matrix subtraction.

```typescript
subtract(other: Matrix): Matrix
```

**Parameters:**

  - `other` - Another matrix to subtract.

**Return Value:**

  - **Matrix** - The new matrix after subtraction $\text{A} - \text{B}$.

**Throws:**

  - `Error` - If the two matrices have mismatched dimensions.

##### multiply

Matrix or scalar multiplication (the passed matrix or number multiplies the original matrix on the right).

```typescript
multiply(other: Matrix | number): Matrix
```

**Parameters:**

  - `other` - Another matrix or a scalar (number).

**Return Value:**

  - **Matrix** - The new matrix after multiplication $\text{A} \times \text{B}$ or $k \text{A}$.

**Throws:**

  - `Error` - If matrix dimensions don't match during matrix multiplication (the number of columns of the current matrix is not equal to the number of rows of the other matrix).

##### isSquare

Check if the matrix is square (number of rows equals number of columns).

```typescript
isSquare(): boolean
```

**Return Value:**

  - **boolean** - Returns `true` if it's a square matrix, otherwise `false`.

##### determinant

Calculate the determinant value of a square matrix. This method uses Gaussian elimination (a variant of LU decomposition) for calculation.

```typescript
determinant(): number
```

**Return Value:**

  - **number** - The determinant value $\det(\text{A})$.

**Throws:**

  - `Error` - If the matrix is not square.

##### inverse

Calculate the inverse matrix of a square matrix. This method uses Gauss-Jordan elimination (augmented matrix method) for calculation.

```typescript
inverse(): Matrix
```

**Return Value:**

  - **Matrix** - The inverse matrix $\text{A}^{-1}$.

**Throws:**

  - `Error` - If the matrix is not square or the matrix is not invertible (singular, i.e., $\det(\text{A}) \approx 0$).

##### equals

Check if two matrices are equal, **considering floating-point errors** (using `Number.EPSILON`).

```typescript
equals(other: Matrix): boolean
```

**Parameters:**

  - `other` - Another matrix.

**Return Value:**

  - **boolean** - Returns `true` if dimensions and all element values are approximately equal.

##### toArray

Return a copy of the matrix data as a two-dimensional array.

```typescript
toArray(): number[][]
```

**Return Value:**

  - **number[][]** - A copy of the matrix as a two-dimensional array.

##### print

Print the matrix to the console in table form (calls `console.table(this.data)`).

```typescript
print(): void
```

#### Examples

```typescript
import { Matrix } from './matrix'; // Assuming correct path

// 1. Construction and static methods
const A = Matrix.fromArray([
  [1, 2],
  [3, 4]
]); // 2x2 matrix
const I = Matrix.identity(2); // 2x2 identity matrix

console.log(A.rows); // 2

// 2. Arithmetic operations
const B = new Matrix(2, 2, 5); // [[5, 5], [5, 5]]
const C = A.add(B);
console.log(C.toArray());
// [[6, 7], [8, 9]]

const D = A.multiply(2);
console.log(D.toArray());
// [[2, 4], [6, 8]]

const E = A.multiply(I); // A * I = A
console.log(E.equals(A)); // true

// 3. Advanced operations
console.log(A.isSquare()); // true
console.log(A.determinant()); // 1*4 - 2*3 = -2

try {
  const A_inv = A.inverse();
  console.log(A_inv.toArray());
  /* Theoretically: 1/(-2) * [[4, -2], [-3, 1]] =
     [[-2, 1], [1.5, -0.5]] */
} catch (error) {
  console.error(error);
}
```

## Features

  * **Comprehensive matrix operations**: Supports addition, subtraction, scalar multiplication, matrix multiplication, transpose.
  * **Floating-point safe**: `determinant`, `inverse`, and `equals` methods have built-in `Number.EPSILON` precision handling mechanism.
  * **Type safe**: Written in TypeScript with clear parameter and return value types.
  * **Gaussian elimination/Jordan elimination**: Uses classic algorithms to calculate determinant and inverse matrix with stable performance.
  * **Error handling**: Clear error throwing for dimension mismatches, non-square matrices, singular matrices, etc.

## ⚠️ Warning
- Inverse matrix and determinant results may have **precision issues**

