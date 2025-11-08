const { throttle, Throttle } = require('../../src');

describe('throttle 节流函数', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('应该立即执行第一次调用', () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn('first');

    expect(mockFn).toHaveBeenCalledWith('first');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('在延迟时间内应该阻止重复执行', () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn('first');
    expect(mockFn).toHaveBeenCalledTimes(1);

    throttledFn('second');
    throttledFn('third');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('应该正确绑定 this 上下文', () => {
    const context = { value: 'test' };
    let receivedContext = null;

    function testFn(this: any) {
      receivedContext = this;
    }

    const throttledFn = throttle(testFn, 100);
    throttledFn.call(context);

    expect(receivedContext).toBe(context);
  });

  test('应该正确传递所有参数', () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn(1, 'two', { three: 3 });

    expect(mockFn).toHaveBeenCalledWith(1, 'two', { three: 3 });
  });

  test('最后一次调用应该在延迟结束后执行', () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn('first');
    expect(mockFn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(50);
    throttledFn('second');

    expect(mockFn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(50);
    expect(mockFn).toHaveBeenCalledWith('second');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  test('应该处理快速连续调用场景', () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn('call1');
    jest.advanceTimersByTime(10);
    throttledFn('call2');
    jest.advanceTimersByTime(10);
    throttledFn('call3');
    jest.advanceTimersByTime(10);
    throttledFn('call4');

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('call1');

    jest.advanceTimersByTime(70);
    expect(mockFn).toHaveBeenCalledWith('call4');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});

describe('Throttle 节流装饰器', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('装饰器 @Throttle 应该正确节流方法', () => {
    const mockFn = jest.fn();

    class Test {
      @Throttle(100)
      method() {
        mockFn();
      }
    }

    const instance = new Test();

    instance.method();
    expect(mockFn).toHaveBeenCalledTimes(1);

    instance.method();
    instance.method();
    expect(mockFn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(2);

    instance.method();
    instance.method();
    jest.advanceTimersByTime(50);
    instance.method();
    jest.advanceTimersByTime(50);
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  test('装饰器 @Throttle 应该正确绑定 this', () => {
    let receivedThis: any = null;

    class Test {
      value = 42;
      @Throttle(100)
      method() {
        receivedThis = this;
      }
    }

    const instance = new Test();
    instance.method();

    expect(receivedThis).toBe(instance);
  });

  test('装饰器 @Throttle 应该正确处理非函数调用', () => {
    expect(() => {
      class Test {
        @Throttle()
        value = 42;
      };
    }).toThrow('Throttle decorator can only be applied to methods');
  });
});
