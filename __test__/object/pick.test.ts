import { pick } from '../../src';

describe('pick', () => {
  const obj = {
    name: 'Alex',
    age: 25,
    city: 'Beijing',
    email: 'alex@example.com',
  };

  test('should pick single key', () => {
    const result = pick(obj, ['name']);
    expect(result).toEqual({ name: 'Alex' });
  });

  test('should pick multiple keys', () => {
    const result = pick(obj, ['name', 'email']);
    expect(result).toEqual({
      name: 'Alex',
      email: 'alex@example.com',
    });
  });

  test('should ignore non-existing keys', () => {
    const result = pick(obj, ['name', 'unknown' as any]);
    expect(result).toEqual({ name: 'Alex' });
  });

  test('should return empty object if no keys picked', () => {
    const result = pick(obj, []);
    expect(result).toEqual({});
  });

  test('should return empty object if keys not found', () => {
    const result = pick(obj, ['foo' as any]);
    expect(result).toEqual({});
  });

  test('should work with empty object', () => {
    // @ts-ignore
    const result = pick({}, ['a']);
    expect(result).toEqual({});
  });
});