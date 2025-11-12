# memorize

## Function - memorize

Cache function

### Parameters

- `fn`: `(...args: any[]) => any` - The function to cache

### Return Value

The cached function

### Examples
```typescript
import { memorize } from '@lengineerc/utils';

// Basic usage
const expensiveCalculation = (n: number) => {
  console.log('Calculating...');
  return n * n * n;
};

const memoizedCalc = memorize(expensiveCalculation);

console.log(memoizedCalc(5)); // Calculating... 125
console.log(memoizedCalc(5)); // 125 (returned from cache)
console.log(memoizedCalc(3)); // Calculating... 27

// Async functions
const fetchData = async (id: number) => {
  console.log('Fetching data...');
  return `data-${id}`;
};

const memoizedFetch = memorize(fetchData);

console.log(await memoizedFetch(1)); // Fetching data... data-1
console.log(await memoizedFetch(1)); // data-1 (returned from cache)

// Object parameters (based on reference comparison)
const processObject = (obj: { value: number }) => {
  console.log('Processing object...');
  return obj.value * 2;
};

const memoizedProcess = memorize(processObject);
const obj = { value: 10 };

console.log(memoizedProcess(obj)); // Processing object... 20
console.log(memoizedProcess(obj)); // 20 (returned from cache)
```
## Function - Memorize

Function cache decorator (called via @ decorator syntax)

### Parameters

### Examples
```typescript
import { Memorize } from '@lengineerc/utils';

class Calculator {
  private callCount = 0;

  @Memorize
  expensiveCalculation(n: number): number {
    this.callCount++;
    console.log(`Calculating ${n}, call count: ${this.callCount}`);
    return n * n * n;
  }

  getCallCount(): number {
    return this.callCount;
  }
}

const calc = new Calculator();

console.log(calc.expensiveCalculation(5)); // Calculating 5, call count: 1
console.log(calc.expensiveCalculation(5)); // 125 (returned from cache)
console.log(calc.getCallCount()); // 1 (actually only calculated once)
```

## Features

- Cache strategy based on parameter reference comparison
- Supports parameters of any type
- Preserves `this` context
- Supports async functions
- Supports decorator syntax
- Type safe
- Automatic memory management

