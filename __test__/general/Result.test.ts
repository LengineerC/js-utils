import { Result } from '../../src';

describe('Result', () => {
  describe('Ok', () => {
    test('创建成功结果的 Result', () => {
      const result = Result.Ok(42);
      expect(result.isOk()).toBe(true);
      expect(result.isErr()).toBe(false);
      expect(result.unwrapOr(0)).toBe(42);
    });
  });

  describe('Err', () => {
    test('创建错误结果的 Result', () => {
      const result = Result.Err('error message');
      expect(result.isErr()).toBe(true);
      expect(result.isOk()).toBe(false);
    });
  });

  describe('fromThrowable', () => {
    test('函数执行成功返回 Ok', () => {
      const result = Result.fromThrowable(() => 42);
      expect(result.isOk()).toBe(true);
      expect(result.unwrapOr(0)).toBe(42);
    });

    test('函数抛出异常返回 Err', () => {
      const result = Result.fromThrowable(() => {
        throw new Error('test error');
      });
      expect(result.isErr()).toBe(true);
    });

    test('捕获特定类型的异常', () => {
      const result = Result.fromThrowable<string, Error>(() => {
        throw new Error('custom error');
      });
      expect(result.isErr()).toBe(true);
      const err = result.match({
        Ok: () => null,
        Err: (e) => e
      });
      expect(err.message).toBe('custom error');
    });
  });

  describe('isOk / isErr', () => {
    test('Ok 时 isOk 返回 true', () => {
      const ok = Result.Ok(1);
      expect(ok.isOk()).toBe(true);
      expect(ok.isErr()).toBe(false);
    });

    test('Err 时 isErr 返回 true', () => {
      const err = Result.Err('error');
      expect(err.isErr()).toBe(true);
      expect(err.isOk()).toBe(false);
    });
  });

  describe('map', () => {
    test('Ok 值映射', () => {
      const result = Result.Ok(5).map(x => x * 2);
      expect(result.unwrapOr(0)).toBe(10);
    });

    test('Err 映射返回 Err', () => {
      const result = Result.Err<string, string>('error').map(x => x * 2);
      expect(result.isErr()).toBe(true);
      expect(result.match({
        Ok: () => 'ok',
        Err: (e) => e
      })).toBe('error');
    });

    test('映射可以改变类型', () => {
      const result = Result.Ok(5).map(x => x.toString());
      expect(result.unwrapOr('')).toBe('5');
    });
  });

  describe('andThen', () => {
    test('Ok 链式调用', () => {
      const result = Result.Ok(5).andThen(x => Result.Ok(x * 2));
      expect(result.unwrapOr(0)).toBe(10);
    });

    test('Ok 返回 Err 传播错误', () => {
      const result = Result.Ok(5).andThen(() => Result.Err('error'));
      expect(result.isErr()).toBe(true);
    });

    test('Err 跳过链式调用', () => {
      const result = Result.Err<string, string>('error').andThen(x => Result.Ok(x * 2));
      expect(result.isErr()).toBe(true);
      expect(result.match({
        Ok: () => 'ok',
        Err: (e) => e
      })).toBe('error');
    });

    test('andThen 可以改变错误类型', () => {
      const result = Result.Ok(5).andThen<string, number>(x => Result.Ok(x.toString()));
      expect(result.isOk()).toBe(true);
    });
  });

  describe('unwrapOr', () => {
    test('Ok 返回内部值', () => {
      expect(Result.Ok(10).unwrapOr(0)).toBe(10);
    });

    test('Err 返回默认值', () => {
      expect(Result.Err<string, string>('error').unwrapOr('default')).toBe('default');
    });
  });

  describe('unwrap', () => {
    test('Some 获取值', () => {
      expect(Result.Ok(10).unwrap()).toBe(10);
    });

    test('None 抛出错误', () => {
      expect(() => Result.Err('test error').unwrap()).toThrow();
      expect(() => Result.Err(new Error('test error')).unwrap()).toThrow();
    });
  });

  describe('match', () => {
    test('Ok 匹配 Ok 分支', () => {
      const result = Result.Ok(42);
      const message = result.match({
        Ok: val => `Success: ${val}`,
        Err: err => `Error: ${err}`
      });
      expect(message).toBe('Success: 42');
    });

    test('Err 匹配 Err 分支', () => {
      const result = Result.Err('something went wrong');
      const message = result.match({
        Ok: val => `Success: ${val}`,
        Err: err => `Error: ${err}`
      });
      expect(message).toBe('Error: something went wrong');
    });

    test('match 可以返回不同类型', () => {
      const okResult = Result.Ok(5);
      const okValue = okResult.match({
        Ok: val => val * 2,
        Err: () => 0
      });
      expect(okValue).toBe(10);

      const errResult = Result.Err<number, string>('error');
      const errValue = errResult.match({
        Ok: val => val * 2,
        Err: () => 0
      });
      expect(errValue).toBe(0);
    });
  });
});
