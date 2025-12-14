import { clamp } from '../../src';

describe('clamp', () => {
  test('should clamp value to max if value > max', () => {
    expect(clamp(10, 0, 5)).toBe(5);
  });

  test('should clamp value to min if value < min', () => {
    expect(clamp(-5, 0, 5)).toBe(0);
  });

  test('should return value if within range', () => {
    expect(clamp(3, 0, 5)).toBe(3);
  });

  test('should handle edge cases where value equals min or max', () => {
    expect(clamp(0, 0, 5)).toBe(0);
    expect(clamp(5, 0, 5)).toBe(5);
  });

  test('should handle floating point numbers', () => {
    expect(clamp(3.5, 1.1, 2.2)).toBe(2.2);
    expect(clamp(0.5, 1.1, 2.2)).toBe(1.1);
  });
});

