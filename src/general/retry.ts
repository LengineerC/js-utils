import { sleep } from './sleep';

export interface RetryOptions {
  retries?: number;
  delay?: number;
  shouldRetry?: (err: any) => boolean;
}

/**
 * 失败重试函数
 * @param {() => Promise<T>} fn 需要执行的异步函数
 * @param {RetryOptions | number} [options=3] 重试次数 或 配置对象
 */
export async function retry<T>(fn: () => Promise<T>, options: RetryOptions | number = 3) {
  let retries = 3;
  let delay = 0;
  let shouldRetry = (_err: any) => true;

  if (typeof options === 'number') {
    retries = options;
  } else if (typeof options === 'object') {
    retries = options.retries ?? 3;
    delay = options.delay ?? 0;
    if (options.shouldRetry) shouldRetry = options.shouldRetry;
  }

  let error: any;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      error = err;
      if (attempt === retries - 1 || !shouldRetry(err)) {
        throw err;
      }

      const waitTime = delay * Math.pow(2, attempt);
      await sleep(waitTime);
    }
  }

  throw error;
}
