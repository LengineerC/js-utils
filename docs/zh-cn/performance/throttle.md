# throttle

## 函数 - throttle

节流函数

### 参数

- `fn`: `(...args: any[]) => any` - 需要节流的函数

- `delay`: `number` - 延迟时间（ms），默认300ms

### 示例
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

## 函数 - Throttle

节流装饰器（用于方法，通过@装饰器语法调用）

### 参数

- `delay`: `number` - 延迟时间（ms），默认300ms

### 示例
```typescript
import { Throttle } from '@lengineerc/utils';

class ScrollComponent {
  @Throttle(100)
  onScroll(event: Event) {
    console.log('滚动处理:', event);
  }

  @Throttle(1000)
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
