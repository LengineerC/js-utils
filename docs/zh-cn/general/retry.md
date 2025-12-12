# retry

## Function - retry

失败自动重试。支持配置重试次数、延迟时间、指数退避策略以及自定义错误过滤逻辑。

### Parameters

- `fn`: `() => Promise<T>` - 需要执行的异步函数。
- `options`: `number | RetryOptions` - 重试配置。
    - 如果传入 `number`: 仅指定重试次数（默认无延迟）。
    - 如果传入 `object`:
        - `retries` (`number`): 最大重试次数 (默认: 3)。
        - `delay` (`number`): 第一次重试前的初始延迟毫秒数 (默认: 0)。
        - `shouldRetry` (`(error: any) => boolean`): 一个返回布尔值的回调函数，用于判断当前错误是否值得重试。

### Return Value

`Promise<T>` - 如果在指定次数内成功，返回函数的执行结果；否则抛出最后一次捕获的异常。

### Examples

## Examples

```typescript
import { retry } from '@lengineerc/utils';

// 1. 简单用法 (失败重试 3 次)
await retry(() => fetchUser(123), 3);

// 2. 高级用法 (指数退避算法)
// 第一次重试等待 1秒，第二次 2秒，第三次 4秒...
await retry(async () => {
  return await api.getData();
}, {
  retries: 3,
  delay: 1000,
});

// 3. 条件重试 (错误过滤)
// 例如：只在服务器报 5xx 错误时重试，404 错误直接抛出
await retry(() => fetch('/api/data'), {
  shouldRetry: (err) => err.status >= 500
});