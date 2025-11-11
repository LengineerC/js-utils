
# groupBy

## 函数 - groupBy

按给定的 iteratee 将集合分组，支持以下几种 iteratee 形式：

- 函数 (item) => key：对每个元素执行函数，返回分组键。
- 数字索引：按元素在数组中的索引进行分组（相同索引的元素会被分到同一组）。
- 字符串路径：支持点分路径，用于访问对象的深层属性（例如 "user.age"）。

当 iteratee 为字符串路径时，如果某个元素在该路径上没有值（undefined 或 null），该元素会被跳过，不会被包含到任何分组中。

函数签名（TypeScript）：

```ts
function groupBy<T = any>(collection: T[] | undefined | null, iteratee: ((item: T) => any) | number | string): Record<string, T[]>
```

### 参数

- collection: 要分组的集合，通常为数组；如果为 null 或 undefined，函数返回空对象。
- iteratee: 用于计算分组键的规则，可以是函数、数字索引或点分路径字符串。

### 返回值

- 返回一个对象（Record<string, T[]>），键为分组键（会被转换为字符串），值为属于该分组的元素数组，元素原样保留（引用不被克隆）。

### 示例

```ts
import { groupBy } from '../../src/array';

// 以函数作为 iteratee
const data = [{ id: 1, type: 'a' }, { id: 2, type: 'b' }, { id: 3, type: 'a' }];
const byType = groupBy(data, item => item.type);
// byType => { a: [{id:1,type:'a'},{id:3,type:'a'}], b: [{id:2,type:'b'}] }

// 以数字索引作为 iteratee（按元素索引分组）
const nums = ['zero', 'one', 'two'];
const byIndex = groupBy(nums, 0); // 所有元素按索引 0 的字符分组

// 以字符串路径作为 iteratee（支持嵌套路径）
const users = [
	{ name: { first: 'foo' }, age: 20 },
	{ name: { first: 'bar' }, age: 21 },
	{ age: 22 }, // name 为空，将被跳过
];
const byFirstName = groupBy(users, 'name.first');
// byFirstName => { foo: [{...}], bar: [{...}] }
```

### 特性
- 如果 `collection` 为空（null/undefined/[]），返回空对象 {}。
- 当 iteratee 为字符串路径且路径不存在，或路径值为 `null`/`undefined`，对应元素会被跳过。
- iteratee 为数字时，会把元素按对应位置的值（例如字符串的第 N 个字符）或按索引含义进行分组；请参考实现以确定具体行为。
- 函数不会克隆元素，返回数组中的元素为原引用（因此循环引用和对象引用会被保留）。
- 键会被转换为字符串作为结果对象的属性名；如果通过函数返回的是对象或 Symbol，最终会调用其 toString（或转为字符串）作为键名。

### 实现备注
- 实现中会优先判断 iteratee 的类型：
	- 函数：直接调用以获取键。
	- 数字：按索引访问或按实现中定义的语义来计算键。
	- 字符串：支持点分路径访问深层属性（如 `a.b.c`）。
- 对于路径访问，若访问过程中任一路径段为 `undefined` 或 `null`，视为无值并跳过该元素。
