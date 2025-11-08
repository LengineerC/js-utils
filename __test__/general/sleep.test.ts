import { sleep } from '../../src';

describe('sleep', () => {
  // 启用 Mock Timer
  beforeAll(() => {
    jest.useFakeTimers();
  });

  // 恢复真实 Timer
  afterAll(() => {
    jest.useRealTimers();
  });

  test('应该返回一个 Promise', () => {
    expect(sleep(100)).toBeInstanceOf(Promise);
  });

  test('Promise 应该在指定的毫秒数后被 resolve', async () => {
    const ms = 2000;

    // 创建一个计时器，用于测试 sleep 后的代码是否被执行
    const callback = jest.fn();

    // 关键：在 sleep 执行后，等待 Promise resolve
    const sleepPromise = sleep(ms).then(callback);

    // 此时 callback 不应该被调用，因为时间还没到
    expect(callback).not.toHaveBeenCalled();

    // 快进时间到 2000ms
    jest.advanceTimersByTime(ms);

    // 确保所有微任务（Promise resolve）被执行
    await sleepPromise;

    // 此时 callback 应该已经被调用了
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('Promise 在等待时间前不应该 resolve', async () => {
    const ms = 1000;
    const callback = jest.fn();
    const sleepPromise = sleep(ms).then(callback);

    // 快进到 999ms (在指定时间前一毫秒)
    jest.advanceTimersByTime(ms - 1);

    // 确保所有微任务被执行
    await Promise.resolve();

    // callback 不应该被调用
    expect(callback).not.toHaveBeenCalled();

    // 快进剩下的 1ms
    jest.advanceTimersByTime(1);

    // 确保所有微任务被执行
    await sleepPromise;

    // callback 应该被调用
    expect(callback).toHaveBeenCalledTimes(1);
  });
});