/**
 * 将数值限制在指定的范围内
 * @param {number} value 需要限制的数值
 * @param {number} min 允许的最小值
 * @param {number} max 允许的最大值
 * @returns {number} 返回被限制在 [min, max] 区间内的数值
 */
export function clamp(value: number, min: number, max: number): number {
  if (min > max) throw new Error('Max value must greatter than min value');

  if (value < min) return min;

  if (value > max) return max;

  return value;
}
