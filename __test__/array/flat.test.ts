import { flat } from '../../dist';

describe('flat function', () => {
  describe('默认全部展开', () => {
    test('应该展平嵌套数组', () => {
      const arr = [1, [2, [3, [4, 5]]], 6];
      expect(flat(arr)).toEqual([1, 2, 3, 4, 5, 6]);
    });

    test('应该处理空数组', () => {
      expect(flat([])).toEqual([]);
    });

    test('应该处理空嵌套数组', () => {
      expect(flat([1, [], [2, []], 3])).toEqual([1, 2, 3]);
    });
  });

  describe('指定展开深度', () => {
    test('depth=0 应该返回原数组', () => {
      const arr = [1, [2, [3]]];
      expect(flat(arr, 0)).toEqual([1, [2, [3]]]);
    });

    test('depth=1 应该展开一层', () => {
      const arr = [1, [2, [3, [4]]], 5];
      expect(flat(arr, 1)).toEqual([1, 2, [3, [4]], 5]);
    });

    test('depth=2 应该展开两层', () => {
      const arr = [1, [2, [3, [4]]], 5];
      expect(flat(arr, 2)).toEqual([1, 2, 3, [4], 5]);
    });
  });

  describe('性能测试', () => {
    test('应该高效处理大数组', () => {
      const createNestedArray = (depth: number, itemsPerLevel: number): any[] => {
        if (depth === 0) return Array(itemsPerLevel).fill(0).map((_, i) => i);
        return [createNestedArray(depth - 1, itemsPerLevel)];
      };

      const bigArray = createNestedArray(100, 10);

      const startTime = performance.now();
      const result = flat(bigArray);
      const endTime = performance.now();

      expect(result.length).toBeGreaterThan(0);
      expect(endTime - startTime).toBeLessThan(1000);
    });

    test('应该避免栈溢出', () => {
      const deepArray: any[] = [1];
      let current = deepArray;
      for (let i = 0; i < 10000; i++) {
        current[0] = [current[0]];
      }

      expect(() => {
        flat(deepArray);
      }).not.toThrow();
    });
  });

  describe('边界情况', () => {
    test('应该处理稀疏数组', () => {
      const sparseArray = [1, , 3];
      const result = flat(sparseArray);
      expect(result).toEqual([1, undefined, 3]);
    });

    test('应该处理包含非数组元素的数组', () => {
      const arr = [1, 'hello', { a: 1 }, null, undefined];
      expect(flat(arr)).toEqual([1, 'hello', { a: 1 }, null, undefined]);
    });

    test('应该正确处理负深度', () => {
      const arr = [1, [2, [3]]];
      expect(flat(arr, -1)).toEqual([1, [2, [3]]]);
    });
  });

  describe('与原生 flat 方法对比', () => {
    test('行为应该与 Array.prototype.flat 一致', () => {
      const testCases = [
        [1, [2, [3, [4]]], 5],
        [],
        [1, 2, 3],
        [[1], [2], [3]],
        [1, [2, [3]], 4]
      ];

      testCases.forEach(testCase => {
        const nativeResult = (testCase as any).flat(Infinity);
        const ourResult = flat(testCase);
        expect(ourResult).toEqual(nativeResult);
      });
    });
  });
});