type Task = () => Promise<any>;

/**
 * 并发控制的 Promise 任务执行器。接受一组返回 Promise 的任务函数并按照给定的并发上限执行，最终返回每个任务的执行结果（不抛出异常，而是以状态描述的形式返回每个任务的结果）。
 * @param {Task[]} tasks 任务函数数组，每个元素是一个返回 Promise 的函数（延迟执行
 * @param {number} limit 并发上限（同时运行的最大任务数），必须为正整数
 * @returns {Promise<Array<{ status: 'fulfilled'; value: any } | { status: 'rejected'; error: any }>>} 执行结果
 */
export function promiseLimit(
  tasks: Task[],
  limit: number,
): Promise<Array<{ status: 'fulfilled'; value: any } | { status: 'rejected'; error: any }>> {
  return new Promise(resolve => {
    if (tasks.length === 0) {
      resolve([]);
      return;
    }

    let currentIndex = 0;
    let completeCount = 0;
    const results: Array<{ status: 'fulfilled'; value: any } | { status: 'rejected'; error: any }> =
      new Array(tasks.length);

    const _limit = Math.min(Math.max(1, limit), tasks.length);

    const runTask = () => {
      if (currentIndex >= tasks.length) {
        return;
      }
      const taskIndex = currentIndex;
      currentIndex++;
      const currentTask = tasks[taskIndex];

      let promise: Promise<any>;

      try {
        promise = Promise.resolve(currentTask());
      } catch (error) {
        promise = Promise.reject(error);
      }

      promise
        .then(value => {
          results[taskIndex] = { status: 'fulfilled', value };
        })
        .catch(error => {
          results[taskIndex] = { status: 'rejected', error };
        })
        .then(() => {
          completeCount++;

          if (completeCount === tasks.length) {
            resolve(results);
          } else {
            runTask();
          }
        });
    };

    for (let i = 0; i < _limit; i++) {
      runTask();
    }
  });
}
