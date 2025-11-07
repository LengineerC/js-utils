import { handleRequest } from '../../src';

function createTask(time: number, shouldReject = false, value?: any) {
  return () => new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldReject) reject(value ?? 'error');
      else resolve(value ?? time);
    }, time);
  });
}

describe('handleRequest - batchRequest (mode=0)', () => {
  test('应该在限制并发下处理所有成功的任务', async () => {
    const tasks = [createTask(50, false, 'a'), createTask(30, false, 'b'), createTask(10, false, 'c')];
    const results = await handleRequest(tasks, 2, 0);

    expect(results.length).toBe(3);
    expect(results[0]).toEqual({ status: 'fulfilled', value: 'a' });
    expect(results[1]).toEqual({ status: 'fulfilled', value: 'b' });
    expect(results[2]).toEqual({ status: 'fulfilled', value: 'c' });
  });

  test('应该正确处理被拒绝的任务', async () => {
    const tasks = [createTask(10, true, 'err1'), createTask(5, false, 'ok')];
    const results = await handleRequest(tasks, 2, 0);

    expect(results.length).toBe(2);
    expect(results[0]).toEqual({ status: 'rejected', error: 'err1' });
    expect(results[1]).toEqual({ status: 'fulfilled', value: 'ok' });
  });
});

describe('handleRequest - controlRequest (mode=1)', () => {
  test('应该遵守并发限制并保持任务顺序', async () => {
    const tasks = [createTask(30, false, 1), createTask(10, false, 2), createTask(20, false, 3), createTask(5, false, 4)];
    const results = await handleRequest(tasks, 2, 1);

    expect(results.map(r => (r as any).status)).toEqual(['fulfilled', 'fulfilled', 'fulfilled', 'fulfilled']);
    expect(results.map(r => (r as any).value)).toEqual([1, 2, 3, 4]);
  });

  test('应该处理混合的成功和失败任务', async () => {
    const tasks = [createTask(5, false, 'ok'), createTask(10, true, 'bad'), createTask(1, false, 'ok2')];
    const results = await handleRequest(tasks, 2, 1);

    expect(results[0]).toEqual({ status: 'fulfilled', value: 'ok' });
    expect(results[1]).toEqual({ status: 'rejected', error: 'bad' });
    expect(results[2]).toEqual({ status: 'fulfilled', value: 'ok2' });
  });
});
