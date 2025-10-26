# debounce

防抖函数，延迟执行函数直到停止调用后的指定时间。

## 函数

### debounce

防抖函数实现。

#### 语法

```typescript
debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300,
  immediate: boolean = false
): (...args: Parameters<T>) => void
```

#### 参数

- `fn` - 需要防抖的函数
- `delay` - 延迟时间（毫秒），默认 300ms
- `immediate` - 是否立即执行，默认 false

#### 返回值

返回防抖后的函数。

#### 示例

```typescript
import { debounce } from '@lengineerc/utils';

// 基本用法
const search = debounce((query: string) => {
  console.log('搜索:', query);
}, 300);

search('a'); // 不会立即执行
search('ab'); // 取消上一次，重新计时
search('abc'); // 取消上一次，重新计时
// 300ms 后执行: 搜索: abc

// 立即执行模式
const save = debounce((data: any) => {
  console.log('保存:', data);
}, 500, true);

save({ id: 1 }); // 立即执行: 保存: { id: 1 }
save({ id: 2 }); // 不会执行，等待 500ms
// 500ms 后可以再次立即执行
```

### debounced

防抖装饰器，用于类方法。

#### 语法

```typescript
debounced(delay: number = 300, immediate: boolean = false): MethodDecorator
```

#### 参数

- `delay` - 延迟时间（毫秒），默认 300ms
- `immediate` - 是否立即执行，默认 false

#### 示例

```typescript
import { debounced } from '@lengineerc/utils';

class SearchComponent {
  @debounced(300)
  onSearch(query: string) {
    console.log('搜索:', query);
  }

  @debounced(500, true)
  onSave(data: any) {
    console.log('保存:', data);
  }
}

const search = new SearchComponent();
search.onSearch('test'); // 300ms 后执行
search.onSave({ id: 1 }); // 立即执行
```

## 特性

- 支持立即执行模式
- 保持 `this` 上下文
- 类型安全
- 支持装饰器语法
- 可配置延迟时间
