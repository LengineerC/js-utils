/**
 * 使用占位符格式化字符串。
 *
 * 支持三种占位符形式：
 * 1. `{}`      : 自动按数组顺序取值
 * 2. `{0}`, `{1}` : 数字索引 (数组)
 * 3. `{name}` : 对象属性
 *
 * @param {string} str 要格式化的字符串
 * @param {Record<string, any> | any[]} args 替换占位符的值，数组或对象
 * @returns {string} 格式化后的字符串
 *
 * @example
 * format("Hello {}, {1}, {name}", [10, 20]);
 * // 输出: "Hello 10, 20, {name}" （对象占位符不会生效，因为传入的是数组）
 */
export function format(str: string, args: Record<string, any> | any[]): string {
  let index = 0;

  return str.replace(/\{([^}]*)\}/g, (_, key) => {
    if (key === '') {
      // {}
      if (Array.isArray(args)) {
        return args[index++] !== undefined ? args[index - 1] : '{}';
      }

      return '{}';
    } else if (/^\d+$/.test(key)) {
      // {0}
      if (Array.isArray(args)) {
        const idx = parseInt(key);
        return args[idx] !== undefined ? args[idx] : `{${key}}`;
      }

      return `{${key}}`;
    } else {
      // {name}
      if (!Array.isArray(args) && key in args) {
        return args[key];
      }

      return `{${key}}`;
    }
  });
}
