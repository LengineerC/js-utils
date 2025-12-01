import { chunk } from '../../src';

describe('chunk function strict tests', () => {

  // ==========================================
  // 1. 普通数组 (Arrays)
  // ==========================================
  describe('Array handling', () => {
    test('should chunk a number array correctly', () => {
      const input = [1, 2, 3, 4, 5];
      const result = chunk(input, 2);

      expect(result).toEqual([[1, 2], [3, 4], [5]]);
      expect(result).toHaveLength(3);
    });

    test('should handle empty arrays', () => {
      const result = chunk([], 3);
      expect(result).toEqual([]);
    });

    test('should handle size larger than length', () => {
      const input = ['a', 'b'];
      const result = chunk(input, 5);
      expect(result).toEqual([['a', 'b']]);
    });

    test('should preserve object references', () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const input = [obj1, obj2];
      const result = chunk(input, 1);

      expect(result[0][0]).toBe(obj1);
      expect(result[1][0]).toBe(obj2);
    });
  });

  // ==========================================
  // 2. 字符串 (Strings)
  // ==========================================
  describe('String handling', () => {
    test('should chunk a string into substrings', () => {
      const input = 'hello world';
      const result = chunk(input, 5);

      expect(result).toEqual(['hello', ' worl', 'd']);
    });

    test('should handle empty string', () => {
      expect(chunk('', 2)).toEqual([]);
    });
  });

  // ==========================================
  // 3. TypedArrays & Node Buffers (Views)
  // ==========================================
  describe('TypedArray & Buffer handling', () => {
    test('should chunk Uint8Array using subarray (shared memory)', () => {
      const input = new Uint8Array([1, 2, 3, 4, 5]);
      const result = chunk(input, 2);

      expect(result).toHaveLength(3);
      expect(result[0]).toBeInstanceOf(Uint8Array);
      expect(result[0]).toEqual(new Uint8Array([1, 2]));
      expect(result[2]).toEqual(new Uint8Array([5]));

      expect(result[0].buffer).toBe(input.buffer);
    });

    test('should chunk Float32Array correctly', () => {
      const input = new Float32Array([1.1, 2.2, 3.3]);
      const result = chunk(input, 2);

      expect(result[0]).toBeInstanceOf(Float32Array);
      expect(result[0].length).toBe(2);
      expect(result[0][0]).toBeCloseTo(1.1);
    });

    test('should chunk Node.js Buffer correctly', () => {
      const input = Buffer.from('abcdef');
      const result = chunk(input, 2);

      expect(result).toHaveLength(3);
      expect(result[0]).toBeInstanceOf(Buffer);
      expect(result[0].toString()).toBe('ab');

      result[0][0] = 99; // ASCII 'c'
      expect(input[0]).toBe(99);
    });
  });

  // ==========================================
  // 4. ArrayBuffer & DataView
  // ==========================================
  describe('ArrayBuffer & DataView handling', () => {
    test('should chunk ArrayBuffer into new ArrayBuffers', () => {
      const input = new Uint8Array([1, 2, 3, 4]).buffer;
      const result = chunk(input, 2);

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(ArrayBuffer);
      expect(result[0].byteLength).toBe(2);

      const view1 = new Uint8Array(result[0]);
      expect(view1[0]).toBe(1);
      expect(view1[1]).toBe(2);

      new Uint8Array(result[0])[0] = 99;
      expect(new Uint8Array(input)[0]).toBe(1);
    });

    test('should chunk DataView into ArrayBuffers', () => {
      const buffer = new Uint8Array([1, 2, 3, 4]).buffer;
      const view = new DataView(buffer);
      const result = chunk(view, 2);

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(ArrayBuffer);

      const checkView = new Uint8Array(result[0]);
      expect(checkView[0]).toBe(1);
    });
  });

  // ==========================================
  // 5. Blob & File (Browser/Node env)
  // ==========================================
  describe('Blob & File handling', () => {
    if (typeof Blob !== 'undefined') {
      test('should chunk Blob correctly', () => {
        const input = new Blob(['Hello World'], { type: 'text/plain' });
        const result = chunk(input, 5);

        expect(result).toHaveLength(3);
        expect(result[0]).toBeInstanceOf(Blob);
        expect(result[0].size).toBe(5);
        expect(result[2].size).toBe(1);
      });

      test('should chunk File correctly (File inherits Blob)', () => {
        if (typeof File !== 'undefined') {
          const input = new File(['123456'], 'test.txt', { type: 'text/plain' });
          const result = chunk(input, 2);

          expect(result[0]).toBeInstanceOf(Blob);
          expect(result[0].size).toBe(2);
        }
      });
    } else {
      console.warn('Skipping Blob tests because Blob is not defined in this environment');
    }
  });

  // ==========================================
  // 6. 边界条件与异常 (Edge Cases & Errors)
  // ==========================================
  describe('Edge Cases & Errors', () => {
    test('should clamp size < 1 to 1', () => {
      const input = [1, 2];
      const result0 = chunk(input, 0);
      const resultNeg = chunk(input, -5);

      expect(result0).toEqual([[1], [2]]);
      expect(resultNeg).toEqual([[1], [2]]);
    });

    test('should round down floating point sizes', () => {
      const input = [1, 2, 3, 4];
      const result = chunk(input, 2.9);

      expect(result).toEqual([[1, 2], [3, 4]]);
    });

    test('should throw TypeError for unsupported types', () => {
      // @ts-ignore - 故意传入错误类型以测试运行时检查
      expect(() => chunk(123, 2)).toThrow(TypeError);
      // @ts-ignore
      expect(() => chunk({}, 2)).toThrow(TypeError);
      // @ts-ignore
      expect(() => chunk(null, 2)).toThrow(TypeError);
    });
  });
});
