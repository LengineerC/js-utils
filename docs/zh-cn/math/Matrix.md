# matrix

用于处理矩阵运算的类，支持基本的算术运算、转置、行列式、逆矩阵等高级功能，并考虑了浮点数精度。

## 类

### Matrix

矩阵类，用于表示和操作二维数字矩阵。

#### 构造函数

```typescript
new Matrix(rows: number, cols: number, defaultValue: number = 0)
```

**描述：**
初始化一个指定行数和列数的矩阵，并用默认值填充。

**参数：**

  - `rows` - **行数**。
  - `cols` - **列数**。
  - `defaultValue` - 默认填充值（默认为 `0`）。

**抛出：**

  - `Error` - 如果 `rows` 或 `cols` 小于或等于 `0`。

#### 成员属性

  * `rows`: **number** - 矩阵的行数。
  * `cols`: **number** - 矩阵的列数。

#### 静态方法

##### fromArray

从二维数组构建矩阵。

```typescript
static fromArray(arr: number[][]): Matrix
```

**参数：**

  - `arr` - 用于构建矩阵的二维数字数组。

**返回值：**

  - **Matrix** - 构建后的矩阵实例。

**抛出：**

  - `Error` - 如果数组不是矩形（即行长度不一致）。

##### identity

获取指定大小的单位矩阵（方阵）。

```typescript
static identity(size: number): Matrix
```

**参数：**

  - `size` - 行列数（即方阵的阶数）。

**返回值：**

  - **Matrix** - 单位矩阵 $\text{I}$。

#### 成员方法

##### get

获取指定位置的元素值。

```typescript
get(row: number, col: number): number
```

**参数：**

  - `row` - 行索引。
  - `col` - 列索引。

**返回值：**

  - **number** - 元素值。

##### set

设置指定位置的元素值。

```typescript
set(row: number, col: number, value: number): void
```

**参数：**

  - `row` - 行索引。
  - `col` - 列索引。
  - `value` - 元素值。

##### transpose

转置矩阵。

```typescript
transpose(): Matrix
```

**返回值：**

  - **Matrix** - 新的转置矩阵 $\text{A}^{\text{T}}$。

##### add

矩阵加法。

```typescript
add(other: Matrix): Matrix
```

**参数：**

  - `other` - 另一个待相加的矩阵。

**返回值：**

  - **Matrix** - 相加后的新矩阵 $\text{A} + \text{B}$。

**抛出：**

  - `Error` - 如果两个矩阵尺寸不匹配。

##### subtract

矩阵减法。

```typescript
subtract(other: Matrix): Matrix
```

**参数：**

  - `other` - 另一个待相减的矩阵。

**返回值：**

  - **Matrix** - 相减后的新矩阵 $\text{A} - \text{B}$。

**抛出：**

  - `Error` - 如果两个矩阵尺寸不匹配。

##### multiply

矩阵或标量乘法（传入的矩阵或数字右乘原矩阵）。

```typescript
multiply(other: Matrix | number): Matrix
```

**参数：**

  - `other` - 另一个矩阵或一个标量（数字）。

**返回值：**

  - **Matrix** - 相乘后的新矩阵 $\text{A} \times \text{B}$ 或 $k \text{A}$。

**抛出：**

  - `Error` - 如果进行矩阵乘法时尺寸不匹配（当前矩阵的列数不等于另一个矩阵的行数）。

##### isSquare

判断矩阵是否为方阵（行数等于列数）。

```typescript
isSquare(): boolean
```

**返回值：**

  - **boolean** - 如果是方阵返回 `true`，否则返回 `false`。

##### determinant

计算方阵的行列式值。该方法使用高斯消元法（LU 分解的变体）计算。

```typescript
determinant(): number
```

**返回值：**

  - **number** - 行列式值 $\det(\text{A})$。

**抛出：**

  - `Error` - 如果矩阵不是方阵。

##### inverse

计算方阵的逆矩阵。该方法使用高斯-约旦消元法（增广矩阵法）计算。

```typescript
inverse(): Matrix
```

**返回值：**

  - **Matrix** - 逆矩阵 $\text{A}^{-1}$。

**抛出：**

  - `Error` - 如果矩阵不是方阵或矩阵不可逆（奇异，即 $\det(\text{A}) \approx 0$）。

##### equals

判断两个矩阵是否相等，**考虑浮点误差**（使用 `Number.EPSILON`）。

```typescript
equals(other: Matrix): boolean
```

**参数：**

  - `other` - 另一个矩阵。

**返回值：**

  - **boolean** - 如果尺寸和所有元素值都近似相等，则返回 `true`。

##### toArray

返回矩阵数据的二维数组副本。

```typescript
toArray(): number[][]
```

**返回值：**

  - **number[][]** - 矩阵的二维数组副本。

##### print

将矩阵以表格形式打印到控制台（调用 `console.table(this.data)`）。

```typescript
print(): void
```

#### 示例

```typescript
import { Matrix } from './matrix'; // 假设路径正确

// 1. 构造与静态方法
const A = Matrix.fromArray([
  [1, 2],
  [3, 4]
]); // 2x2 矩阵
const I = Matrix.identity(2); // 2x2 单位矩阵

console.log(A.rows); // 2

// 2. 算术运算
const B = new Matrix(2, 2, 5); // [[5, 5], [5, 5]]
const C = A.add(B);
console.log(C.toArray());
// [[6, 7], [8, 9]]

const D = A.multiply(2);
console.log(D.toArray());
// [[2, 4], [6, 8]]

const E = A.multiply(I); // A * I = A
console.log(E.equals(A)); // true

// 3. 高级运算
console.log(A.isSquare()); // true
console.log(A.determinant()); // 1*4 - 2*3 = -2

try {
  const A_inv = A.inverse();
  console.log(A_inv.toArray());
  /* 理论上：1/(-2) * [[4, -2], [-3, 1]] =
     [[-2, 1], [1.5, -0.5]] */
} catch (error) {
  console.error(error);
}
```

## 特性

  * **全面的矩阵运算**：支持加、减、标量乘、矩阵乘、转置。
  * **浮点安全**：`determinant`、`inverse` 和 `equals` 方法内置了 `Number.EPSILON` 精度处理机制。
  * **类型安全**：采用 TypeScript 编写，参数和返回值类型清晰。
  * **高斯消元/约旦消元**：使用经典算法计算行列式和逆矩阵，性能稳定。
  * **错误处理**：对尺寸不匹配、非方阵、奇异矩阵等情况进行明确的错误抛出。

## ⚠️ 警告
- 逆矩阵和行列式的结果可能有**精度问题**