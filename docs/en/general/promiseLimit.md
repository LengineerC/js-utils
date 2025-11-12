# promiseLimit

## Function - promiseLimit

A Promise task executor with concurrency control. Accepts an array of functions that return Promises and executes them according to a given concurrency limit, finally returning the execution result of each task (does not throw exceptions, but returns each task's result in the form of a status description).

### Parameters

- `tasks`: `Array<() => Promise<any>>` - Array of task functions, each element is a function that returns a Promise (lazy execution).
- `limit`: `number` - Concurrency limit (maximum number of tasks running simultaneously), must be a positive integer.

### Return Value

Returns `Promise<Array<{ status: 'fulfilled'; value: any } | { status: 'rejected'; error: any }>>`.

- The overall Promise always resolves (will not reject due to a child task rejecting).
- The returned array corresponds one-to-one with the `tasks` array, with index order matching the input tasks, making it easy to locate each task's result.

### Examples

```typescript
import { promiseLimit } from '@lengineerc/utils';

// Helper: Create an async task generator (for examples)
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

  // Execute concurrently, with at most two tasks running simultaneously
  const results = await promiseLimit(tasks, 2);

  console.log(results);
  // Possible output:
  // [ { status: 'fulfilled', value: 'A' },
  //   { status: 'rejected', error: 'ERR' },
  //   { status: 'fulfilled', value: 'C' } ]
}

run();
```

### Features

- Supports concurrency control (limit the number of simultaneously running tasks via `limit`).
- Preserves original task order, result array indices correspond to `tasks`.
- Captures success/failure status of each task, uniformly returns in object form (does not throw).

### Notes

- Each item in `tasks` should be a function (do not pass already started Promises), so that the function can start tasks at a controlled time.
- `limit` should be a positive integer; when `limit` is greater than or equal to the number of tasks, all tasks will start as simultaneously as possible.
- If a task throws a synchronous exception internally, that exception will be caught internally via Promise and returned as `{ status: 'rejected', error }`.
- This function is suitable for scenarios that need to limit concurrent requests (network requests, IO, etc.) and get the execution result of each task.

