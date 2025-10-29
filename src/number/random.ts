/**
 * 生成一个闭区间内的整数
 * @param {number} min 最小值（包含）
 * @param {number} max 最大值（包含）
 * @returns {number} 随机整数
 */
export function genRandomInt(min: number, max: number): number {
  if (!Number.isFinite(min)) {
    throw new Error(`Minimum value must be a finite number, received: ${min}`);
  }

  if (!Number.isFinite(max)) {
    throw new Error(`Maximum value must be a finite number, received: ${max}`);
  }

  if (min > max) {
    throw new Error(`Minimum value cannot exceed the maximum value: min=${min}, max=${max}`);
  }

  if (min === max) {
    return min;
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 生成一个闭区间内的浮点数
 * @param {number} min 最小值（包含，默认0）
 * @param {number} max 最大值（包含，默认1）
 * @param {number} precision 精度（默认1位小数）
 * @returns {number} 随机浮点数
 */
export function genRandomFloat(min: number = 0, max: number = 1, precision: number = 1): number {
  if (typeof min !== 'number' || !Number.isFinite(min)) {
    throw new TypeError(`Minimum value must be a finite number, received: ${min}`);
  }

  if (typeof max !== 'number' || !Number.isFinite(max)) {
    throw new TypeError(`Maximum value must be a finite number, received: ${max}`);
  }

  if (min > max) {
    throw new RangeError(`Minimum value cannot exceed the maximum value: ${min} > ${max}`);
  }

  if (typeof precision !== 'number' || !Number.isInteger(precision) || precision < 0) {
    throw new TypeError(`Precision must be a non-negative integer, received: ${precision}`);
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
 * @param {number} probability 生成为true的概率（默认0.5）
 * @returns {boolean} 随机布尔值
 */
export function genRandomBoolean(probability: number = 0.5): boolean {
  if (typeof probability !== 'number' || !Number.isFinite(probability)) {
    throw new TypeError(`Probability must be a finite number, received: ${probability}`);
  }

  if (probability < 0 || probability > 1) {
    throw new RangeError(`Probability must be between 0 and 1, received: ${probability}`);
  }

  if (probability === 0) return false;
  if (probability === 1) return true;

  return Math.random() < probability;
}
