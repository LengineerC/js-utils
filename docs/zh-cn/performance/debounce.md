# debounce

## 函数 - debounce

防抖函数

### 参数

- `fn`: `(...args: any[]) => any` - 需要防抖的函数

- `delay`: `number` - 延迟时间（ms），默认300ms

- `immediate`: `boolean` - 是否立即执行

### 示例
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

## 函数 - debounced

防抖函数装饰器（用于方法，通过@装饰器语法调用）

### 参数

- `delay`: `number` - 延迟时间（ms），默认300ms

- `immediate`: `boolean` - 是否立即执行

### 示例

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