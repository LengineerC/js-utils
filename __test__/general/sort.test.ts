import { compareVersion } from '../../src';

describe('compareVersion', () => {
  describe('基础比较功能', () => {
    test('应该正确比较相同版本号', () => {
      expect(compareVersion('1.0.0', '1.0.0')).toBe(0);
      expect(compareVersion('2.1.3', '2.1.3')).toBe(0);
      expect(compareVersion('0.0.1', '0.0.1')).toBe(0);
    });

    test('应该正确比较不同长度的版本号', () => {
      expect(compareVersion('1.0', '1.0.0')).toBe(0);
      expect(compareVersion('1.0.0', '1.0')).toBe(0);
      expect(compareVersion('1', '1.0.0')).toBe(0);
    });

    test('应该识别较大版本号', () => {
      expect(compareVersion('2.0.0', '1.0.0')).toBe(1);
      expect(compareVersion('1.1.0', '1.0.0')).toBe(1);
      expect(compareVersion('1.0.1', '1.0.0')).toBe(1);
      expect(compareVersion('1.10.0', '1.9.0')).toBe(1);
    });

    test('应该识别较小版本号', () => {
      expect(compareVersion('1.0.0', '2.0.0')).toBe(-1);
      expect(compareVersion('1.0.0', '1.1.0')).toBe(-1);
      expect(compareVersion('1.0.0', '1.0.1')).toBe(-1);
      expect(compareVersion('1.9.0', '1.10.0')).toBe(-1);
    });
  });

  describe('边界情况测试', () => {
    test('应该处理单个数字版本', () => {
      expect(compareVersion('1', '2')).toBe(-1);
      expect(compareVersion('2', '1')).toBe(1);
      expect(compareVersion('1', '1')).toBe(0);
    });

    test('应该处理两位版本号', () => {
      expect(compareVersion('1.0', '1.1')).toBe(-1);
      expect(compareVersion('1.1', '1.0')).toBe(1);
      expect(compareVersion('2.0', '1.9')).toBe(1);
    });

    test('应该处理多位版本号', () => {
      expect(compareVersion('1.2.3.4', '1.2.3.5')).toBe(-1);
      expect(compareVersion('2.1.0.0', '2.0.9.9')).toBe(1);
      expect(compareVersion('1.0.0.0', '1.0.0.0')).toBe(0);
    });

    test('应该处理长度差异较大的版本号', () => {
      expect(compareVersion('1', '1.0.0.0.0')).toBe(0);
      expect(compareVersion('1.0', '1.0.0.0')).toBe(0);
      expect(compareVersion('2.0.0', '1.9.9.9.9.9')).toBe(1);
      expect(compareVersion('1.0.0.1', '1.1')).toBe(-1);
    });
  });

  describe('数字比较逻辑', () => {
    test('应该正确处理多位数版本', () => {
      expect(compareVersion('1.10.0', '1.9.0')).toBe(1);
      expect(compareVersion('1.9.0', '1.10.0')).toBe(-1);
      expect(compareVersion('2.0.1', '2.0.10')).toBe(-1);
      expect(compareVersion('1.20.0', '1.100.0')).toBe(-1);
    });

    test('应该正确处理前导零', () => {
      expect(compareVersion('1.01.0', '1.1.0')).toBe(0);
      expect(compareVersion('1.00.0', '1.0.0')).toBe(0);
      expect(compareVersion('01.0.0', '1.0.0')).toBe(0);
    });
  });

  describe('与Array.sort集成测试', () => {
    test('应该可用于数组排序', () => {
      const versions = [
        '1.0.0',
        '2.1.0',
        '1.1.0',
        '0.9.0',
        '2.0.0',
        '1.0.1'
      ];

      const sorted = versions.sort(compareVersion);
      
      expect(sorted).toEqual([
        '0.9.0',
        '1.0.0',
        '1.0.1',
        '1.1.0',
        '2.0.0',
        '2.1.0'
      ]);
    });

    test('应该正确处理复杂版本号排序', () => {
      const versions = [
        '1',
        '1.0',
        '1.0.0',
        '0.9.9',
        '1.0.1',
        '1.10.0',
        '1.2.0',
        '2.0.0'
      ];

      const sorted = versions.sort(compareVersion);
      
      expect(sorted).toEqual([
        '0.9.9',
        '1',
        '1.0',
        '1.0.0',
        '1.0.1',
        '1.2.0',
        '1.10.0',
        '2.0.0'
      ]);
    });

    test('应该保持相等版本的相对顺序', () => {
      const versions = [
        '1.0.0',
        '1.0',
        '1.0.0.0',
        '1'
      ];

      const sorted = versions.sort(compareVersion);
      
      // 所有版本都相等，应该保持原顺序（但具体取决于排序算法的稳定性）
      expect(sorted).toHaveLength(4);
      expect(sorted.every(v => compareVersion(v, '1.0.0') === 0)).toBe(true);
    });
  });

  describe('错误和特殊情况', () => {
    test('应该处理空字符串', () => {
      expect(compareVersion('', '1.0.0')).toBe(-1);
      expect(compareVersion('1.0.0', '')).toBe(1);
      expect(compareVersion('', '')).toBe(0);
    });

    test('应该处理非数字字符', () => {
      expect(compareVersion('1.a.0', '1.0.0')).toBe(0);
      expect(compareVersion('1.0.0', '1.b.0')).toBe(0);
      expect(compareVersion('1.x.y', '1.x.y')).toBe(0);
    });

    test('应该处理包含特殊字符的版本号', () => {
      expect(compareVersion('1.0.0-beta', '1.0.0')).toBe(-1);
      expect(compareVersion('1.0.0', '1.0.0-alpha')).toBe(1);
    });
  });

  describe('性能测试', () => {
    test('应该高效处理长版本号', () => {
      const longVersion1 = '1.' + '0.'.repeat(1000) + '1';
      const longVersion2 = '1.' + '0.'.repeat(1000) + '2';
      
      const startTime = performance.now();
      const result = compareVersion(longVersion1, longVersion2);
      const endTime = performance.now();
      
      expect(result).toBe(-1);
      expect(endTime - startTime).toBeLessThan(10); // 应该在10ms内完成
    });

    test('应该高效处理大量版本号排序', () => {
      const versions = Array.from({ length: 1000 }, (_, i) => 
        `1.${Math.floor(i / 10)}.${i % 10}`
      );
      
      const startTime = performance.now();
      const sorted = versions.sort(compareVersion);
      const endTime = performance.now();
      
      expect(sorted).toHaveLength(1000);
      expect(compareVersion(sorted[0], sorted[999])).toBe(-1);
      expect(endTime - startTime).toBeLessThan(100); // 应该在100ms内完成
    });
  });

  describe('实际应用场景', () => {
    test('应该符合语义化版本规范', () => {
      const testCases = [
        { a: '0.1.0', b: '0.2.0', expected: -1 },
        { a: '1.0.0', b: '1.0.1', expected: -1 },
        { a: '1.2.3', b: '1.2.4', expected: -1 },
        { a: '2.0.0', b: '1.999.999', expected: 1 },
        { a: '1.0.0-alpha', b: '1.0.0', expected: -1 },
      ];

      testCases.forEach(({ a, b, expected }) => {
        expect(compareVersion(a, b)).toBe(expected);
      });
    });

    test('应该正确处理大数字版本', () => {
      expect(compareVersion('2023.1.1', '2022.12.31')).toBe(1);
      expect(compareVersion('10.0.0', '9.999.999')).toBe(1);
      expect(compareVersion('999.999.999', '1000.0.0')).toBe(-1);
    });
  });
});