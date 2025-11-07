type Task = () => Promise<any>;

function batchRequest(tasks: Task[], limit: number): Promise<Array<{status: string, value: any} | {status: string, error: any}>> {
    const results: Array<{status: string, value: any} | {status: string, error: any}> = new Array(tasks.length);
    let index = 0;

    const runBatch = (): Promise<void> => {
        if (index >= tasks.length) return Promise.resolve();  // 所有任务完成

        // Slice the tasks array to get the next batch
        const batch = tasks.slice(index, index + limit).map((task, i) => {
            const realIndex = index + i;  // The original index of the task
            return task()
                .then(value => ({ status: 'fulfilled', value }))
                .catch(error => ({ status: 'rejected', error }))
                .then(result => {
                    results[realIndex] = result;  // 存储任务的结果
                });
        });

        index += limit;
        return Promise.all(batch).then(() => {
            if (index < tasks.length) {
                console.log('Executing next batch of tasks');
            }
            return runBatch();
        });
    };

    return runBatch().then(() => results);  // Return a promise that resolves with the final results
}


function controlRequest(tasks: Task[], limit: number): Promise<Array<{status: string, value: any} | {status: string, error: any}>> {
    return new Promise(resolve => {
        let currentIndex = 0;
        let completeCount = 0;
        let currentRunTask = 0;
        const results: Array<{status: string, value: any} | {status: string, error: any}> = new Array(tasks.length);

        const runTask = (): void => {
            // 循环直到所有任务执行完成
            while (currentIndex < tasks.length && currentRunTask < limit) {
                const taskIndex = currentIndex;
                currentIndex++; // 增加索引，指向下一个任务
                currentRunTask++; // 增加并发任务数量

                const currentTask = tasks[taskIndex];
                console.log(`【启动】任务${taskIndex + 1} （并发数: ${currentRunTask}）`);

                // 执行任务
                Promise.resolve(currentTask())
                    .then(value => {
                        results[taskIndex] = { status: 'fulfilled', value };
                    })
                    .catch(error => {
                        results[taskIndex] = { status: 'rejected', error };
                    })
                    .then(() => {
                        // 使用最后的 .then 替代 .finally，保证在 ES6 环境中也能执行收尾逻辑
                        completeCount++;
                        currentRunTask--;

                        // 如果所有任务完成，返回结果
                        if (completeCount === tasks.length) {
                            resolve(results);
                        } else {
                            runTask(); // 启动下一个任务
                        }
                    });
            }
        };

        runTask(); // 启动任务队列
    });
}


type Mode = 0 | 1;  // Mode can be either 0 or 1

export function handleRequest(tasks: Task[], limit: number, mode: Mode = 0): Promise<Array<{status: string, value: any} | {status: string, error: any}>> {
    // Depending on the mode, use the appropriate function
    if (mode === 1) {
        console.log("Using controlRequest method...");
        return controlRequest(tasks, limit);
    } else {
        console.log("Using batchRequest method...");
        return batchRequest(tasks, limit);
    }
}
