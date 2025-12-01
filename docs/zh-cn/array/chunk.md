# chunk

## 函数 - chunk

将数组、字符串或二进制数据拆分成指定长度的块。

### 参数

- `source`: `any[] | string | ArrayBuffer | ArrayBufferView | Blob` - 需要分块的数据源。支持普通数组、字符串、Node.js Buffer、TypedArray、ArrayBuffer 以及浏览器端的 Blob/File 对象。
- `size`: `number` - 每个分块的大小。默认为 `1`。

### 返回值

`ChunkReturnType<T>` - 包含分块数据的数组。返回类型根据输入自动推断：
- **Array/String**: 返回浅拷贝的切片 (`Array<T[]>` 或 `string[]`)。
- **Buffer/TypedArray**: 返回共享内存的视图 (`subarray`)
- **Blob/File**: 返回 Blob 切片（仅是指针），非常适合大文件分片上传。
- **ArrayBuffer**: 返回复制的 ArrayBuffer 块。

### 示例


```typescript
import { chunk } from '@lengineerc/utils';

// 1. 基础数组用法
const arr = [1, 2, 3, 4, 5];
console.log(chunk(arr, 2)); 
// 输出: [[1, 2], [3, 4], [5]]

// 2. 字符串用法
console.log(chunk('hello', 2)); 
// 输出: ['he', 'll', 'o']

// 3. Node.js Buffer / TypedArray (零拷贝)
const buf = Buffer.from([1, 2, 3, 4]);
const chunks = chunk(buf, 2); 
// 输出: [ <Buffer 01 02>, <Buffer 03 04> ]
// 注意: 返回的 Buffer 分块与原数据共享内存。

// 4. File / Blob (浏览器环境)
// 适用于大文件分片上传，不会立即读取文件内容到内存中
const file = new File(['content'], 'data.txt');
const fileChunks = chunk(file, 1024); 
// 输出: [ Blob, Blob, ... ]