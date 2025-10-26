# throttle

节流函数，限制函数在指定时间内的执行频率。

## 函数

### throttle

节流函数实现。

#### 语法

```typescript
throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): (...args: Parameters<T>) => void
```

#### 参数

- `fn` - 需要节流的函数
- `delay` - 延迟时间（毫秒），默认 300ms

#### 返回值

返回节流后的函数。

#### 示例

```typescript
import { throttle } from '@lengineerc/utils';

// 基本用法
const scrollHandler = throttle((event: Event) => {
  console.log('滚动事件:', event);
}, 100);

window.addEventListener('scroll', scrollHandler);
// 在 100ms 内只会执行一次

// 按钮点击节流
const buttonClick = throttle(() => {
  console.log('按钮被点击');
}, 1000);

document.getElementById('button')?.addEventListener('click', buttonClick);
// 1秒内只能点击一次

// 输入框节流
const inputHandler = throttle((value: string) => {
  console.log('输入值:', value);
}, 300);

document.getElementById('input')?.addEventListener('input', (e) => {
  inputHandler((e.target as HTMLInputElement).value);
});
```

### throttled

节流装饰器，用于类方法。

#### 语法

```typescript
throttled(delay: number = 300): MethodDecorator
```

#### 参数

- `delay` - 延迟时间（毫秒），默认 300ms

#### 示例

```typescript
import { throttled } from '@lengineerc/utils';

class ScrollComponent {
  @throttled(100)
  onScroll(event: Event) {
    console.log('滚动处理:', event);
  }

  @throttled(1000)
  onButtonClick() {
    console.log('按钮点击处理');
  }
}

const component = new ScrollComponent();

// 快速滚动时，100ms 内只会执行一次
window.addEventListener('scroll', component.onScroll.bind(component));

// 快速点击时，1秒内只会执行一次
document.getElementById('button')?.addEventListener('click', component.onButtonClick.bind(component));
```

## 与防抖的区别

| 特性 | 节流 (throttle) | 防抖 (debounce) |
|------|----------------|-----------------|
| 执行时机 | 固定时间间隔执行 | 停止调用后延迟执行 |
| 使用场景 | 滚动、鼠标移动等连续事件 | 搜索输入、按钮点击等 |
| 执行频率 | 限制最高频率 | 延迟到最后一次调用 |

## 特性

- 保持 `this` 上下文
- 类型安全
- 支持装饰器语法
- 可配置延迟时间
- 处理边界情况
