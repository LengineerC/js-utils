# retry

## Function - retry

Retries an asynchronous function upon failure with customizable delay, backoff strategy, and error filtering.

### Parameters

- `fn`: `() => Promise<T>` - The asynchronous function to execute.
- `options`: `number | RetryOptions` - Configuration options.
    - If `number`: Specifies the number of retries (default delay is 0).
    - If `object`:
        - `retries` (`number`): Max number of retries (default: 3).
        - `delay` (`number`): Initial delay in ms before the first retry (default: 0).
        - `shouldRetry` (`(error: any) => boolean`): Callback to determine if retry should proceed based on the error.

### Return Value

`Promise<T>` - Resolves with the result of the function if successful within the allowed attempts, otherwise rejects with the last error.

### Examples

## Examples

```typescript
import { retry } from '@lengineerc/utils';

// 1. Simple Usage (Retry 3 times)
await retry(() => fetchUser(123), 3);

// 2. Advanced Usage (Exponential Backoff)
// Wait 1s, then 2s, then 4s...
await retry(async () => {
  return await api.getData();
}, {
  retries: 3,
  delay: 1000,
});

// 3. Conditional Retry
// Only retry on 5xx server errors, fail immediately on 4xx
await retry(() => fetch('/api/data'), {
  shouldRetry: (err) => err.status >= 500
});
