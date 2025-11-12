# LRUCache

## Class - LRUCache

LRU Cache

### Constructor
#### Parameters

- `capacity`: `number` - Cache capacity

### Member Method - get

Get a cached element

#### Parameters

- `key`: `K` - The cache key

#### Return Value

`V | undefined` - The cached value

### Member Method - set

Set cache, if cache exists, update the value

#### Parameters

- `key`: `K` - The cache key

- `value`: `V` - The cache value

### Member Method - has

Check if a corresponding cache exists

#### Parameters

- `key`: `K` - The cache key

#### Return Value

`boolean` - Whether the corresponding cache exists

### Member Method - delete

Delete cache

#### Parameters

- `key`: `K` - The cache key

#### Return Value

`boolean` - Whether deletion was successful (returns false if node doesn't exist)

### Examples
```typescript
const lruCache = new LRUCache(3);

lruCache.set(1, 'a');
lruCache.has(1);
lruCache.get(1); // 'a'
lruCache.delete(1);
```

