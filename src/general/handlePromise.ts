type Task = () => Promise<any>;

export function handleRequest(
  tasks: Task[],
  limit: number,
): Promise<Array<{ status: 'fulfilled'; value: any } | { status: 'rejected'; error: any }>> {
  return new Promise(resolve => {
    let currentIndex = 0;
    let completeCount = 0;
    let currentRunTask = 0;
    const results: Array<{ status: 'fulfilled'; value: any } | { status: 'rejected'; error: any }> =
      new Array(tasks.length);

    const runTask = (): void => {
      // 循环启动任务：未遍历完所有任务 且 未达到并发上限
      while (currentIndex < tasks.length && currentRunTask < limit) {
        const taskIndex = currentIndex;
        currentIndex++;
        currentRunTask++;

        const currentTask = tasks[taskIndex];

        // 执行任务并捕获结果
        Promise.resolve(currentTask())
          .then(value => {
            results[taskIndex] = { status: 'fulfilled', value };
          })
          .catch(error => {
            results[taskIndex] = { status: 'rejected', error };
          })
          .then(() => {
            // 任务完成后更新状态，启动下一个任务
            completeCount++;
            currentRunTask--;

            // 所有任务完成时返回结果
            if (completeCount === tasks.length) {
              resolve(results);
            } else {
              runTask();
            }
          });
      }
    };

    runTask(); // 初始化启动任务队列
  });
}
