import { range } from '../../src';

describe('range', () => {
  // Test Case 1: 单参数调用 (start=0, end=5, step=1)
  test('应该使用默认值 (0, end, 1) 生成序列', () => {
    expect(range(5)).toEqual([0, 1, 2, 3, 4]);
  });

  // Test Case 2: 正常调用 (start=1, end=6, step=1)
  test('应该生成从 start 到 end-1 的整数序列', () => {
    expect(range(1, 6)).toEqual([1, 2, 3, 4, 5]);
  });

  // Test Case 3: 正向步长 (step > 1)
  test('应该使用指定的正向步长生成序列', () => {
    expect(range(2, 10, 2)).toEqual([2, 4, 6, 8]);
  });

  // Test Case 4: 负向步长 (step < 0)
  test('应该使用指定的负向步长生成倒序序列', () => {
    expect(range(5, 0, -1)).toEqual([5, 4, 3, 2, 1]);
  });

  // Test Case 5: 步长过大，返回空数组
  test('当步长太大以至于无法到达 end 时，返回首项', () => {
    expect(range(1, 10, 10)).toEqual([1]);
    expect(range(1, 10, 11)).toEqual([1]);
  });

  // Test Case 6: 步长为 0 (根据之前的实现返回空数组)
  test('当步长为 0 时，返回空数组', () => {
    expect(range(1, 5, 0)).toEqual([]);
  });

  // Test Case 7: 浮点数 (虽然不常用，但应该能处理)
  // test('应该能处理浮点数步长', () => {
  //   expect(range(0, 1, 0.2)).toEqual([0, 0.2, 0.4, 0.6 + Number.EPSILON / 2, 0.8]);
  // });
});