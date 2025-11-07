import { omit } from '../../src';

describe('omit', () => {
  const obj = {
    name: 'Alex',
    age: 25,
    city: 'Beijing',
    email: 'alex@example.com',
  };

  test('should omit single key', () => {
    const result = omit(obj, ['email']);
    expect(result).toEqual({
      name: 'Alex',
      age: 25,
      city: 'Beijing',
    });
  });

  test('should omit multiple keys', () => {
    const result = omit(obj, ['email', 'city']);
    expect(result).toEqual({
      name: 'Alex',
      age: 25,
    });
  });

  test('should return the same object if no keys are omitted', () => {
    const result = omit(obj, []);
    expect(result).toEqual(obj);
  });

  test('should ignore non-existing keys', () => {
    const result = omit(obj, ['unknown' as any]);
    expect(result).toEqual(obj);
  });

  test('should return empty object if all keys are omitted', () => {
    const result = omit(obj, ['name', 'age', 'city', 'email']);
    expect(result).toEqual({});
  });

  test('should work with empty object', () => {
    // @ts-ignore
    const result = omit({}, ['a']);
    expect(result).toEqual({});
  });
});