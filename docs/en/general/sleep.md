# sleep

## Function - sleep

Returns a Promise for pausing the execution of the current async/await flow.

### Parameters

- `ms`: `number` - The number of milliseconds to pause.

### Return Value

`Promise<void>` - A `Promise` that will be `resolve`d after the specified milliseconds.

### Examples

```ts
async function fetchData() {
    for (let i = 0; i < 3; i++) {
        try {
            // ... try to call API
            return result; 
        } catch (error) {
            if (i < 2) {
                await sleep(1000 * (i + 1)); // First wait 1s, second wait 2s
            } else {
                throw error; // Throw after last failure
            }
        }
    }
}
```

