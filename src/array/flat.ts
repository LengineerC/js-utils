/**
 * 数组展平
 * @param arr 需要展平的数组
 * @param depth 展平深度，默认全部展平
 * @returns 展平后的数组
 */
export function flat(arr: any[], depth: number = Infinity) {
  if (arr.length === 0 || depth === 0) return arr;

  const result: any[] = [];
  const stack: { val: any; depth: number }[] = [];

  for (let i = arr.length - 1; i >= 0; i--) {
    stack.push({ val: arr[i], depth: 0 });
  }

  while (stack.length > 0) {
    const { val, depth: currentDepth } = stack.pop()!;
    if (Array.isArray(val) && currentDepth < depth) {
      for (let i = val.length - 1; i >= 0; i--) {
        stack.push({ val: val[i], depth: currentDepth + 1 });
      }
    } else {
      result.push(val);
    }
  }

  return result;
}
