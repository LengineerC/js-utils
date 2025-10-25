/**
 * 生成一个闭区间内的整数
 * @param min 最小值（包含）
 * @param max 最大值（包含）
 * @returns 随机整数
 */
export function genRandomInt(min: number, max: number): number {
  if (!Number.isFinite(min)) {
    throw new Error(`最小值必须是有限数字，收到: ${min}`);
  }

  if (!Number.isFinite(max)) {
    throw new Error(`最大值必须是有限数字，收到: ${max}`);
  }

  if (min > max) {
    throw new Error(`最小值不能大于最大值: min=${min}, max=${max}`);
  }

  if (min === max) {
    return min;
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 生成一个闭区间内的浮点数
 * @param min 最小值（包含，默认0）
 * @param max 最大值（包含，默认1）
 * @param precision 精度（默认1位小数）
 * @returns 随机浮点数
 */
export function genRandomFloat(min: number = 0, max: number = 1, precision: number = 1): number {
  if (typeof min !== 'number' || !Number.isFinite(min)) {
    throw new TypeError(`最小值必须是有限数字，收到: ${min}`);
  }

  if (typeof max !== 'number' || !Number.isFinite(max)) {
    throw new TypeError(`最大值必须是有限数字，收到: ${max}`);
  }

  if (min > max) {
    throw new RangeError(`最小值不能大于最大值: ${min} > ${max}`);
  }

  if (typeof precision !== 'number' || !Number.isInteger(precision) || precision < 0) {
    throw new TypeError(`精度必须是非负整数，收到: ${precision}`);
  }

  if (min === max) {
    return min;
  }

  const randomValue = Math.random() * (max - min) + min;

  if (precision === 0) {
    return Math.floor(randomValue);
  }

  return Number(randomValue.toFixed(precision));
}

/**
 * 生成随机布尔值
 * @param probability 生成为true的概率（默认0.5）
 * @returns 随机布尔值
 */
export function genRandomBoolean(probability: number = 0.5): boolean {
  if (typeof probability !== 'number' || !Number.isFinite(probability)) {
    throw new TypeError(`概率必须是有限数字，收到: ${probability}`);
  }

  if (probability < 0 || probability > 1) {
    throw new RangeError(`概率必须在 0-1 之间，收到: ${probability}`);
  }

  if (probability === 0) return false;
  if (probability === 1) return true;

  return Math.random() < probability;
}
