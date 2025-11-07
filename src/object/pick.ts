/**
 * 根据键名提取对象键值对，类似ts的Pick
 * @param {object} obj 源对象
 * @param {string[]} keys 需要提取的键名数组
 * @returns {object} 由输入的键名提取的对象
 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;

  for (const key of keys) {
    if (key in obj) {
      (result as any)[key] = obj[key];
    }
  }

  return result;
}
