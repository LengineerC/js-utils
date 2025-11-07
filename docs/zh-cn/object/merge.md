# merge

## 函数 - merge

深度合并两个对象，并返回合并后的对象

### 参数

- `target`: `any` - 目标对象

- `source`: `any` - 源对象

### 返回值

`any` - 合并后的对象

### 示例
#### 普通对象
```typescript
const a = { user: { name: 'Alex', info: { age: 18 } } };
const b = { user: { info: { age: 20, city: 'Beijing' } } };

// { user: { name: 'Alex', info: { age: 20, city: 'Beijing' } } }
const result = merge(a, b);
```
#### 数组
```typescript
const arr1 = [1, 2, { nested: [3, 4] }];
const arr2 = [5, { nested: [6] }];

// [5, { nested: [6, 4] }]
const result = merge(arr1, arr2);
```
#### Map
```typescript
const map1 = new Map([
  ['a', 1],
  ['b', new Map([['x', 10]])]
]);

const map2 = new Map([
  ['b', new Map([['y', 20]])],
  ['c', 3]
]);

// Map { 'a' => 1, 'b' => Map { 'x' => 10, 'y' => 20 }, 'c' => 3 }
const result = merge(map1, map2);
```

#### Set
```typescript
const set1 = new Set([1, 2, 3]);
const set2 = new Set([3, 4, 5]);

// Set { 1, 2, 3, 4, 5 }
const result = merge(set1, set2);
```
### 注意事项
- 覆盖逻辑为`source`内元素覆盖`target`
- 不支持`class`实例