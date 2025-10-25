const { debounce, throttled } = require('../dist');
// import { debounce, throttled } from "../dist";

describe('debounce 防抖函数', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('应该延迟执行函数', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('test');
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(50);
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(50);
    expect(mockFn).toHaveBeenCalledWith('test');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('应该延迟执行函数(装饰器)', () => {
    const mockFn = jest.fn();

    class Test {
      @debounce(100)
      decoratedMethod() {
        mockFn();
      }
    }

    const instance = new Test();
    instance.decoratedMethod();
    instance.decoratedMethod();
    instance.decoratedMethod();

    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('多次快速调用应该只执行最后一次', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('first');
    debouncedFn('second');
    debouncedFn('third');

    jest.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledWith('third');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('immediate=true 时应该立即执行', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100, true);

    debouncedFn('test');

    expect(mockFn).toHaveBeenCalledWith('test');
    expect(mockFn).toHaveBeenCalledTimes(1);

    debouncedFn('test2');
    expect(mockFn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(100);
    debouncedFn('test3');
    expect(mockFn).toHaveBeenCalledWith('test3');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  test('应该正确绑定 this 上下文', () => {
    const context = { value: 'test' };
    let receivedContext = null;

    function testFn(this: any) {
      receivedContext = this;
    }

    const debouncedFn = debounce(testFn, 100);
    debouncedFn.call(context);

    jest.advanceTimersByTime(100);

    expect(receivedContext).toBe(context);
  });

  test('应该正确传递所有参数', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn(1, 'two', { three: 3 });

    jest.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledWith(1, 'two', { three: 3 });
  });

  test('应该处理零延迟', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 0);

    debouncedFn();
    jest.advanceTimersByTime(0);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('应该处理连续的时间前进', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('first');
    jest.advanceTimersByTime(50);
    debouncedFn('second');
    jest.advanceTimersByTime(50);
    debouncedFn('third');
    jest.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledWith('third');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('应该正确处理清除定时器', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);


    for (let i = 0; i < 10; i++) {
      debouncedFn();
      jest.advanceTimersByTime(10);
    }

    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});

describe('throttled 节流函数', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('应该立即执行第一次调用', () => {
    const mockFn = jest.fn();
    const throttledFn = throttled(mockFn, 100);

    throttledFn('first');

    expect(mockFn).toHaveBeenCalledWith('first');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('在延迟时间内应该阻止重复执行', () => {
    const mockFn = jest.fn();
    const throttledFn = throttled(mockFn, 100);

    throttledFn('first');
    expect(mockFn).toHaveBeenCalledTimes(1);

    throttledFn('second');
    throttledFn('third');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('应该阻止重复执行函数(装饰器)', () => {
    const mockFn = jest.fn();

    class Test {
      @throttled(100)
      throttledMethod() {
        mockFn();
      }
    }

    const instance = new Test();

    instance.throttledMethod();
    instance.throttledMethod();
    instance.throttledMethod();

    expect(mockFn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(50);
    expect(mockFn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(50);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  test('应该正确绑定 this 上下文', () => {
    const context = { value: 'test' };
    let receivedContext = null;

    function testFn(this: any) {
      receivedContext = this;
    }

    const throttledFn = throttled(testFn, 100);
    throttledFn.call(context);

    expect(receivedContext).toBe(context);
  });

  test('应该正确传递所有参数', () => {
    const mockFn = jest.fn();
    const throttledFn = throttled(mockFn, 100);

    throttledFn(1, 'two', { three: 3 });

    expect(mockFn).toHaveBeenCalledWith(1, 'two', { three: 3 });
  });

  test('最后一次调用应该在延迟结束后执行', () => {
    const mockFn = jest.fn();
    const throttledFn = throttled(mockFn, 100);

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
    const throttledFn = throttled(mockFn, 100);

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