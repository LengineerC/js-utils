# Result

## 类 - Result

Result 类型，表示一个操作的结果，可能是成功（Ok）或者失败（Err）。

### 类型参数

- `T` - Ok 变体中包含的成功值的类型
- `E` - Err 变体中包含的错误值的类型

### 静态方法

#### Ok

创建一个成功结果的 Result。

```typescript
static Ok<T, E = never>(val: T): Result<T, E>
```

**参数**

- `val`: `T` - 成功的值

**返回值**

返回成功结果的 Result

#### Err

创建一个错误结果的 Result。

```typescript
static Err<E, T = never>(err: E): Result<T, E>
```

**参数**

- `err`: `E` - 错误的值

**返回值**

返回错误结果的 Result

#### fromThrowable

包装一个可能抛出异常的函数为 Result 类型。

```typescript
static fromThrowable<T, E = Error>(fn: () => T): Result<T, E>
```

**参数**

- `fn`: `() => T` - 可能抛出异常的函数

**返回值**

成功返回 Ok，异常返回 Err

### 实例方法

#### isOk

判断是否为成功结果。

```typescript
isOk(): boolean
```

**返回值**

如果是成功结果返回 true，否则返回 false

#### isErr

判断是否为错误结果。

```typescript
isErr(): boolean
```

**返回值**

如果是错误结果返回 true，否则返回 false

#### map

如果是 Ok，则使用函数转换内部值；如果是 Err，则返回 Err。

```typescript
map<U>(fn: (val: T) => U): Result<U, E>
```

**参数**

- `fn`: `(val: T) => U` - 转换函数

**返回值**

返回转换后的 Result

#### andThen

链式调用，如果是 Ok 则执行函数返回新的 Result，如果是 Err 则返回 Err。

```typescript
andThen<U>(fn: (val: T) => Result<U, E>): Result<U, E>
```

**参数**

- `fn`: `(val: T) => Result<U, E>` - 返回 Result 的函数

**返回值**

返回链式调用的 Result

#### unwrapOr

获取内部值，如果是 Err 则返回默认值。

```typescript
unwrapOr(defaultValue: T): T
```

#### unwrap

获取内部值，如果是 Err 则抛出错误。

```typescript
unwrap(): T
```

**返回值**

返回内部值

**抛出**

如果值为 None 则抛出错误

**参数**

- `defaultValue`: `T` - 默认值

**返回值**

返回成功值或默认值

#### match

模式匹配，根据是 Ok 还是 Err 执行对应的函数。

```typescript
match<U>(cases: { Ok: (val: T) => U; Err: (err: E) => U }): U
```

**参数**

- `cases`: `{ Ok: (val: T) => U; Err: (err: E) => U }` - 包含 Ok 和 Err 处理函数的对象

**返回值**

返回对应分支的返回值

### 示例

```typescript
import { Result } from '@lengineerc/utils';

// 创建 Result
const okResult = Result.Ok(42);
const errResult = Result.Err('error message');

// 检查结果
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
  Ok: val => `成功: ${val}`,
  Err: err => `错误: ${err}`
});
console.log(message); // 成功: 42

// fromThrowable
const safeDivide = (a: number, b: number) => {
  if (b === 0) throw new Error('除数不能为零');
  return a / b;
};

const safeResult = Result.fromThrowable(() => safeDivide(10, 0));
console.log(safeResult.isErr()); // true
```

## 特性

- 类型安全地处理操作结果
- 灵感来自 Rust 的 Result 类型
- 提供转换和链式操作的方法
- 支持通过 fromThrowable 处理异常
- 支持 match 方法进行模式匹配
