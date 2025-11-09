import { format } from '../../src';

describe('format', () => {
  it('自动占位符 {}', () => {
    expect(format('Hello {}, {}!', ['Alice', 'Bob'])).toBe('Hello Alice, Bob!');
  });

  it('数组索引 {0}, {1}', () => {
    expect(format('Score: {0}, {1}', [10, 20])).toBe('Score: 10, 20');
  });

  it('对象属性 {name}', () => {
    expect(format('Hello {name}, your score is {score}', { name: 'Alice', score: 99 }))
      .toBe('Hello Alice, your score is 99');
  });

  it('不存在的占位符保持原样', () => {
    expect(format('Hello {foo}', {})).toBe('Hello {foo}');
  });

  it('混合 {} 和数组索引', () => {
    expect(format('{}, {1}, {2}', [1, 2, 3])).toBe('1, 2, 3');
  });

  it('空数组或对象', () => {
    expect(format('Hello {}', [])).toBe('Hello {}');
    expect(format('Hello {name}', {})).toBe('Hello {name}');
  });
});