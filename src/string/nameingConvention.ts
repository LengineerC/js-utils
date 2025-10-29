/**
 * 字符串或对象键名小驼峰转下划线
 * @param {any} obj 对象
 * @param {boolean} isString 是否处理单个字符串（默认false）
 * @returns {any} 转换后的对象
 */
export function camelToSnake(obj: any, isString: boolean = false): any {
  if (isString) {
    if (typeof obj === 'string')
      return obj
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .toLowerCase();
    else return obj;
  }

  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return (obj as any[]).map(item => {
      if (typeof item === 'object') camelToSnake(item);
      else return item;
    });
  }

  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .toLowerCase();

    (acc as any)[snakeKey] = camelToSnake((obj as any)[key]);
    return acc;
  }, {} as any);
}

/**
 * 字符串或对象键名下划线转小驼峰
 * @param {any} obj 对象
 * @param {boolean} isString 是否处理单个字符串（默认false）
 * @returns {any} 转换后的对象
 */
export function snakeToCamel(obj: any, isString: boolean = false): any {
  if (isString) {
    if (typeof obj === 'string')
      return obj.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    else return obj;
  }

  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return (obj as any[]).map(item => {
      if (typeof item === 'object') camelToSnake(item);
      else return item;
    });
  }

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

    acc[camelKey] = snakeToCamel(obj[key]);
    return acc;
  }, {} as any);
}
