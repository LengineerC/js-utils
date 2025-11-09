# sleep

## 函数 - sleep

返回一个 Promise，用于暂停当前 async/await 流程的执行。

### 参数

- `ms`: `number` - - 需要暂停的毫秒数。

### 返回值

`Promise<void>` - 一个`Promise`，将在指定毫秒后被`resolve`。

### 示例

```ts
async function fetchData() {
    for (let i = 0; i < 3; i++) {
        try {
            // ... 尝试调用 API
            return result; 
        } catch (error) {
            if (i < 2) {
                await sleep(1000 * (i + 1)); // 第一次等 1s，第二次等 2s
            } else {
                throw error; // 最后一次失败后抛出
            }
        }
    }
}
```