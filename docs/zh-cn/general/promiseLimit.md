# promiseLimit

## 函数 - promiseLimit

并发控制的 Promise 任务执行器。接受一组返回 Promise 的任务函数并按照给定的并发上限执行，最终返回每个任务的执行结果（不抛出异常，而是以状态描述的形式返回每个任务的结果）。

### 参数

- `tasks`: `Array<() => Promise<any>>` - 任务函数数组，每个元素是一个返回 Promise 的函数（延迟执行）。
- `limit`: `number` - 并发上限（同时运行的最大任务数），必须为正整数。

### 返回值

返回值为 `Promise<Array<{ status: 'fulfilled'; value: any } | { status: 'rejected'; error: any }>>`。

- 总体 Promise 始终 resolve（不会因为某个子任务 reject 而导致整个函数 reject）。
- 返回数组与 `tasks` 数组一一对应，索引顺序与输入任务一致，便于定位每个任务的结果。

### 示例

```typescript
import { promiseLimit } from '@lengineerc/utils';

// 辅助：创建一个异步任务生成器（用于示例）
function createTask(time: number, shouldReject = false, value?: any) {
  return () =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldReject) reject(value ?? 'error');
        else resolve(value ?? time);
      }, time);
    });
}

async function run() {
  const tasks = [
    createTask(100, false, 'A'),
    createTask(50, true, 'ERR'),
    createTask(10, false, 'C'),
  ];

  // 并发执行，最多同时两个任务运行
  const results = await promiseLimit(tasks, 2);

  console.log(results);
  // 可能输出：
  // [ { status: 'fulfilled', value: 'A' },
  //   { status: 'rejected', error: 'ERR' },
  //   { status: 'fulfilled', value: 'C' } ]
}

run();
```

### 特性

- 支持并发控制（通过 `limit` 限制同时运行的任务数）。
- 保留任务原始顺序，结果数组的索引与 `tasks` 对应。
- 捕获每个任务的成功/失败状态，统一以对象形式返回（不会抛出）。

### 注意事项

- `tasks` 中每一项应为函数（不要传入已经启动的 Promise），以便函数在受控的时刻启动任务。
- `limit` 应为正整数；当 `limit` 大于或等于任务数量时，所有任务会尽可能同时启动。
- 若任务内部抛出同步异常，该异常会被内部通过 Promise 捕获并作为 `{ status: 'rejected', error }` 返回。
- 该函数适合需要限制并发请求（网络请求、IO 等）并获取每个任务执行结果的场景。
