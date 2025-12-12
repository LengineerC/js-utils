import { retry } from '../../src';

jest.mock('../../src/general/sleep', () => ({
  sleep: jest.fn(() => Promise.resolve()),
}));

import { sleep } from '../../src';

describe('retry function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return result immediately if function succeeds', async () => {
    const mockFn = jest.fn().mockResolvedValue('success');
    const result = await retry(mockFn);

    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(sleep).not.toHaveBeenCalled();
  });

  test('should retry and succeed eventually', async () => {
    const mockFn = jest.fn()
      .mockRejectedValueOnce(new Error('Fail 1'))
      .mockResolvedValue('success');

    const result = await retry(mockFn, 3);

    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(2);

    expect(sleep).toHaveBeenCalledTimes(1);
  });

  test('should throw error after max retries exceeded', async () => {
    const error = new Error('Always Fail');
    const mockFn = jest.fn().mockRejectedValue(error);

    await expect(retry(mockFn, 3)).rejects.toThrow('Always Fail');

    expect(mockFn).toHaveBeenCalledTimes(3);
    expect(sleep).toHaveBeenCalledTimes(2);
  });

  test('should use exponential backoff with factor 2', async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error('Fail'));
    const delay = 100;

    try {
      await retry(mockFn, { retries: 3, delay });
    } catch (e) {
      // Ignore error
    }
    expect(sleep).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenNthCalledWith(1, 100);
    expect(sleep).toHaveBeenNthCalledWith(2, 200);
  });

  test('should stop retrying if shouldRetry returns false', async () => {
    const mockFn = jest.fn()
      .mockRejectedValueOnce(new Error('Keep Trying'))
      .mockRejectedValueOnce(new Error('Stop Now'));

    const shouldRetry = (err: any) => err.message !== 'Stop Now';

    await expect(retry(mockFn, { retries: 5, shouldRetry })).rejects.toThrow('Stop Now');

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledTimes(1);
  });
});