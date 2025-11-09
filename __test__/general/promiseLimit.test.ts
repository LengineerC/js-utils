import { promiseLimit } from '../../src';

function createTask(time: number, shouldReject = false, value?: any) {
  return () => new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldReject) reject(value ?? 'error');
      else resolve(value ?? time);
    }, time);
  });
}

describe('promiseLimit', () => {
  test('应该在限制并发下处理所有成功的任务', async () => {
    const tasks = [createTask(50, false, 'a'), createTask(30, false, 'b'), createTask(10, false, 'c')];
    const results = await promiseLimit(tasks, 2);

    expect(results.length).toBe(3);
    expect(results[0]).toEqual({ status: 'fulfilled', value: 'a' });
    expect(results[1]).toEqual({ status: 'fulfilled', value: 'b' });
    expect(results[2]).toEqual({ status: 'fulfilled', value: 'c' });
  });

  test('应该正确处理被拒绝的任务', async () => {
    const tasks = [createTask(10, true, 'err1'), createTask(5, false, 'ok')];
    const results = await promiseLimit(tasks, 2);

    expect(results.length).toBe(2);
    expect(results[0]).toEqual({ status: 'rejected', error: 'err1' });
    expect(results[1]).toEqual({ status: 'fulfilled', value: 'ok' });
  });

  test('应该处理混合的成功和失败任务', async () => {
    const tasks = [
      createTask(5, false, 'ok'),
      createTask(10, true, 'bad'),
      createTask(1, false, 'ok2'),
    ];
    const results = await promiseLimit(tasks, 2);

    expect(results[0]).toEqual({ status: 'fulfilled', value: 'ok' });
    expect(results[1]).toEqual({ status: 'rejected', error: 'bad' });
    expect(results[2]).toEqual({ status: 'fulfilled', value: 'ok2' });
  });

  test('应该遵守并发限制并保持任务顺序', async () => {
    const tasks = [createTask(30, false, 1), createTask(10, false, 2), createTask(20, false, 3), createTask(5, false, 4)];
    const results = await promiseLimit(tasks, 2);

    expect(results.map(r => (r as any).status)).toEqual(['fulfilled', 'fulfilled', 'fulfilled', 'fulfilled']);
    expect(results.map(r => (r as any).value)).toEqual([1, 2, 3, 4]);
  });

  test('空tasks，应该返回空数组', async () => {
    const results = await promiseLimit([], 10);

    expect(results).toEqual([]);
  });

  test('limit <= 0应该正确执行', async () => {
    const tasks = [createTask(30, false, 1), createTask(10, false, 2), createTask(20, false, 3), createTask(5, false, 4)];
    const results = await promiseLimit(tasks, 0);

    expect(results.map(r => (r as any).status)).toEqual(['fulfilled', 'fulfilled', 'fulfilled', 'fulfilled']);
    expect(results.map(r => (r as any).value)).toEqual([1, 2, 3, 4]);

    const tasks2 = [createTask(30, false, 1), createTask(10, false, 2), createTask(20, false, 3), createTask(5, false, 4)];
    const results2 = await promiseLimit(tasks2, -1);

    expect(results2.map(r => (r as any).status)).toEqual(['fulfilled', 'fulfilled', 'fulfilled', 'fulfilled']);
    expect(results2.map(r => (r as any).value)).toEqual([1, 2, 3, 4]);
  });

  test('应该正确处理同步任务', async () => {
    const tasks: any[] = [
      () => 1,
      () => 'sync task',
      () => {
        throw new Error('Sync Error');
      },
      () => null
    ];

    const expectedResults = [
      { status: 'fulfilled', value: 1 },
      { status: 'fulfilled', value: 'sync task' },
      expect.objectContaining({
        status: 'rejected',
        error: expect.objectContaining({ message: 'Sync Error' })
      }),
      { status: 'fulfilled', value: null },
    ];

    const results = await promiseLimit(tasks, 2);

    expect(results.length).toBe(tasks.length);
    expect(results).toEqual(expectedResults);
  });
});
