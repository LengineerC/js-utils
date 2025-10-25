import { curry } from "../../dist";

describe("柯里化", () => {
  test('正确执行函数', () => {
    function addFnnc(a: number, b: number, c: number) {
      return a + b + c;
    }

    const addArrowFunc = (a: number, b: number, c: number) => {
      return a + b + c;
    };

    const curriedAdd = curry(addFnnc);

    expect(curriedAdd(1)(2)(3)).toBe(6);
    expect(curriedAdd(1, 2)(3)).toBe(6);
    expect(curriedAdd(1)(2, 3)).toBe(6);
    expect(curriedAdd(1, 2, 3)).toBe(6);

    const curriedArrowAdd = curry(addArrowFunc);
    expect(curriedArrowAdd(1)(2)(3)).toBe(6);
    expect(curriedArrowAdd(1, 2)(3)).toBe(6);
    expect(curriedArrowAdd(1)(2, 3)).toBe(6);
    expect(curriedArrowAdd(1, 2, 3)).toBe(6);
  });

  test('对象方法 this 上下文', () => {
    const calculator = {
      base: 10,
      add(a: number, b: number, c: number) {
        return this.base + a + b + c;
      }
    };

    const curriedAdd = curry(calculator.add);

    const boundAdd = curriedAdd.bind(calculator);

    expect(boundAdd(1)(2)(3)).toBe(16);
    expect(boundAdd(1, 2)(3)).toBe(16);
    expect(boundAdd(1)(2, 3)).toBe(16);
    expect(boundAdd(1, 2, 3)).toBe(16);
  });
});