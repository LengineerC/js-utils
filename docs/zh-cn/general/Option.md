# Option

## 类 - Option

Option 类型，表示一个可选值，可能是某个值（Some）或者空（None）。

### 类型参数

- `T` - Some 变体中包含的值的类型

### 静态方法

#### Some

创建一个包含值的 Option。

```typescript
static Some<T>(value: T): Option<T>
```

**参数**

- `value`: `T` - 要包装的值

**返回值**

返回包含该值的 Option

#### None

创建一个空值 Option。

```typescript
static None<T = never>(): Option<T>
```

**返回值**

返回空值的 Option

#### from

根据值创建 Option，如果值为 null 或 undefined 则返回 None，否则返回 Some。

```typescript
static from<T>(value: T | undefined | null): Option<T>
```

**参数**

- `value`: `T | undefined | null` - 要转换的值

**返回值**

如果值不为 null 和 undefined 返回 Some，否则返回 None

### 实例方法

#### isSome

判断是否为 Some（有值）。

```typescript
isSome(): boolean
```

**返回值**

如果包含值返回 true，否则返回 false

#### isNone

判断是否为 None（无值）。

```typescript
isNone(): boolean
```

**返回值**

如果为 None 返回 true，否则返回 false

#### map

如果是 Some，则使用函数转换内部值；如果是 None，则返回 None。

```typescript
map<U>(fn: (val: T) => U): Option<U>
```

**参数**

- `fn`: `(val: T) => U` - 转换函数

**返回值**

返回转换后的 Option

#### unwrap

获取内部值，如果是 None 则抛出错误。

```typescript
unwrap(): T
```

**返回值**

返回内部值

**抛出**

如果值为 None 则抛出错误

#### unwrapOr

获取内部值，如果是 None 则返回默认值。

```typescript
unwrapOr(defaultValue: T): T
```

**参数**

- `defaultValue`: `T` - 默认值

**返回值**

返回内部值或默认值

### 示例

```typescript
import { Option } from '@lengineerc/utils';

// 创建 Option
const someValue = Option.Some(42);
const noneValue = Option.None();
const fromValue = Option.from(42);
const fromNull = Option.from(null);

// 检查值
console.log(someValue.isSome()); // true
console.log(someValue.isNone()); // false

// Map
const mapped = Option.Some(5).map(x => x * 2);
console.log(mapped.unwrap()); // 10

// Unwrap
console.log(Option.Some(10).unwrap()); // 10
console.log(Option.None().unwrapOr(0)); // 0
```

## 特性

- 类型安全地处理可选值
- 灵感来自 Rust 的 Option 类型
- 提供转换和提取值的方法
- 支持 null 和 undefined 作为 "None" 值
