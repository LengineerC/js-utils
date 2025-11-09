/**
 * 返回一个 Promise，用于暂停当前 async/await 流程的执行。
 * @param {number} ms 需要暂停的毫秒数。
 * @returns {Promise<void>} 一个Promise，将在指定毫秒后被resolve。
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
