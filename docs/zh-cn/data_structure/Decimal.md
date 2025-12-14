# Decimal

用于处理高精度十进制数运算的类。支持任意精度的加法、减法、乘法和除法运算，避免 JavaScript 中浮点数运算的精度问题。

## 类 (Class)

### Decimal

表示一个高精度十进制数的类。

#### 构造函数

```typescript
new Decimal(value: string | number | Decimal = '0', precision: number = 10)
```

**参数：**

- `value: string | number | Decimal` - 初始值，可以是字符串、数字或另一个 Decimal 对象（默认为 '0'）
- `precision: number` - 精度，即保留的小数位数（默认为 10）

#### 成员属性 (Properties)

##### ZERO (static)

静态属性，表示值为 0 的 Decimal 实例。

```typescript
static ZERO = new Decimal('0')
```

##### value (getter)

获取 Decimal 对象的内部字符串表示。

```typescript
get value(): string
```

**返回值：**

- `string` - Decimal 对象的字符串值

#### 成员方法 (Methods)

##### toString

将 Decimal 对象转换为标准的十进制数字符串表示形式。

```typescript
public toString(): string
```

**返回值：**

- `string` - 标准十进制数字符串（包含小数点）

##### add

与另一个 Decimal 对象进行加法运算。

```typescript
public add(o: Decimal): Decimal
```

**参数：**

- `o: Decimal` - 要相加的 Decimal 对象

**返回值：**

- `Decimal` - 返回加法运算后的 Decimal 结果

##### sub

与另一个 Decimal 对象进行减法运算。

```typescript
public sub(o: Decimal): Decimal
```

**参数：**

- `o: Decimal` - 要相减的 Decimal 对象

**返回值：**

- `Decimal` - 返回减法运算后的 Decimal 结果

##### mul

与另一个 Decimal 对象进行乘法运算。

```typescript
public mul(o: Decimal): Decimal
```

**参数：**

- `o: Decimal` - 要相乘的 Decimal 对象

**返回值：**

- `Decimal` - 返回乘法运算后的 Decimal 结果

##### div

与另一个 Decimal 对象进行除法运算。

```typescript
public div(o: Decimal): Decimal
```

**参数：**

- `o: Decimal` - 要相除的 Decimal 对象

**返回值：**

- `Decimal` - 返回除法运算后的 Decimal 结果

#### 示例

```typescript
// 假设已导入 Decimal

// 1. 基本使用
const a = new Decimal('0.1');
const b = new Decimal('0.2');
const result = a.add(b);
console.log(result.toString()); // 输出: "0.3"

// 2. 高精度计算
const c = new Decimal('123.456789');
const d = new Decimal('987.654321');
const product = c.mul(d);
console.log(product.toString()); // 输出高精度乘法结果

// 3. 链式运算
const e = new Decimal('100');
const f = new Decimal('50');
const g = new Decimal('10');
const chainedResult = e.add(f).sub(g); // (100 + 50) - 10 = 140
console.log(chainedResult.toString());
```