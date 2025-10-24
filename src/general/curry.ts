type Tail<T extends any[]> =
  ((...args: T) => any) extends ((arg1: any, ...tail: infer A) => any) ? A : [];

type Prepend<E, T extends any[]> =
  ((arg: E, ...args: T) => any) extends ((...args: infer U) => any) ? U : T;

type Drop<N extends number, T extends any[], I extends any[] = []> = {
  0: Drop<N, Tail<T>, Prepend<any, I>>,
  1: T
}[Length<I> extends N ? 1 : 0];

type Cast<X, Y> = X extends Y ? X : Y;

type Length<T extends any[]> = T['length'];

type Curry<P extends any[], R> =
  <T extends any[]>(...args: Cast<T, Partial<P>>) =>
    Drop<Length<T>, P> extends [any, ...any[]]
      ? Curry<Drop<Length<T>, P> extends infer DT ? Cast<DT, any[]> : never, R>
      : R;

type Curried<F> = F extends (...args: infer P) => infer R
  ? Curry<P, R>
  : never;

export function curry<F extends (...args: any[]) => any>(fn: F): Curried<F> {
  function curried(this: any, ...args: any[]): any {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      const currentThis = this;

      return function (this: any, ...args2: any[]) {
        return curried.apply(currentThis, args.concat(args2));
      };
    }
  }
  return curried as Curried<F>;
}

// function createCurryFn<F extends (this: any, ...args: any[]) => any>(fn: F): Curried<F> {
//   function curried(this: any, ...args: any[]): any {
//     if (args.length >= fn.length) {
//       return fn.apply(this, args);
//     } else {
//       const currentThis = this;

//       return function (this: any, ...args2: any[]) {
//         return curried.apply(currentThis, args.concat(args2));
//       };
//     }
//   }
//   return curried as Curried<F>;
// }

// export function curry<F extends (this: any, ...args: any[]) => any>(fn: F): Curried<F>;
// export function curry<F extends (this: any, ...args: any[]) => any>(
//   target: any,
//   propertyKey?: string,
//   descriptor?: TypedPropertyDescriptor<F>
// ): any;
// export function curry(...args: any[]): any {
//   if (typeof args[0] === 'function' && args.length === 1) {
//     return createCurryFn(args[0]);
//   }

//   if (
//     args.length === 0 ||
//     (typeof args[0] === 'object' &&
//       typeof args[1] === 'string' &&
//       typeof args[2] === 'object')
//   ) {
//     const [target, propertyKey, descriptor] = args;
//     const fn = descriptor.value;
    
//     if (typeof fn !== 'function') {
//       throw new Error('@curry can only be applied to methods');
//     }

//     const curriedFn = createCurryFn(fn);
    
//     return {
//       ...descriptor,
//       get() {
//         return (...curryArgs: any[]) => curriedFn.apply(this, curryArgs);
//       }
//     };
//   }
// }
