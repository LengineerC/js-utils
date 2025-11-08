/**
 * 生成一个包含指定范围数字的数组，类似Python。
 * @param {number} start - 起始值（包含）。如果只提供一个参数，则视为 end，start 默认为 0。
 * @param {number} end - 结束值（不包含）。
 * @param {number} step - 步长，默认为 1。可以为负数。
 * @returns {number[]} 包含数字序列的数组。
 */
export function range(start: number, end?: number, step?: number): number[] {
  if (end === undefined) {
    end = start;
    start = 0;
  }

  step = step === undefined ? (start < end ? 1 : -1) : step;

  if (step === 0) {
    return [];
  }

  let res: number[] = [];
  let current = start;
  if (step > 0) {
    while (current < end) {
      res.push(current);
      current += step;
    }
  } else {
    while (current > end) {
      res.push(current);
      current += step;
    }
  }

  return res;
}
