# LRUCache

## 类 - LRUCache

LRU缓存

### 构造器
#### 参数

- `capacity`: `number` - 缓存容量

### 成员方法 - get

获取缓存元素

#### 参数

- `key`: `K` - 缓存的key

#### 返回值

`V | undefined` - 缓存的值

### 成员方法 - set

设置缓存，如果缓存存在，更新值

#### 参数

- `key`: `K` - 缓存的key

- `value`: `V` - 缓存的值

### 成员方法 - has

查询是否存在对应缓存

#### 参数

- `key`: `K` - 缓存的key

#### 返回值

`boolean` - 是否存在对应缓存

### 成员方法 - delete

删除缓存

#### 参数

- `key`: `K` - 缓存的key

#### 返回值

`boolean` - 是否删除成功（节点不存在返回false）

### 示例
```typescript
const lruCache = new LRUCache(3);

lruCache.set(1, 'a');
lruCache.has(1);
lruCache.get(1); // 'a'
lruCache.delete(1);
```
