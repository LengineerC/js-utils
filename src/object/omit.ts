/**
 * 根据键名排除对象键值对，类似ts的Omit
 * @param {object} obj 源对象
 * @param {string[]} keys 需要排除的键名数组
 * @returns {object} 排除输入的键名后的对象
 */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = {} as Omit<T, K>;

  for (const key in obj) {
    if (!keys.includes(key as any)) {
      (result as any)[key] = obj[key];
    }
  }

  return result;
}
