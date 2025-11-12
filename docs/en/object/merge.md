# merge

## Function - merge

Deep merge two objects and return the merged object

### Parameters

- `target`: `any` - Target object

- `source`: `any` - Source object

### Return Value

`any` - The merged object

### Examples
#### Regular Objects
```typescript
const a = { user: { name: 'Alex', info: { age: 18 } } };
const b = { user: { info: { age: 20, city: 'Beijing' } } };

// { user: { name: 'Alex', info: { age: 20, city: 'Beijing' } } }
const result = merge(a, b);
```
#### Arrays
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
### Notes
- Override logic: elements in `source` override elements in `target`
- Does not support `class` instances

