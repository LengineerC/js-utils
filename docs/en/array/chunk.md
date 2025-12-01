# chunk

## Function - chunk

Splits a collection (Array, String, or Binary Data) into groups of the specified length.

### Parameters

- `source`: `any[] | string | ArrayBuffer | ArrayBufferView | Blob` - The data source to process. Supports Arrays, Strings, Node.js Buffers, TypedArrays, ArrayBuffers, and Blob/File objects.
- `size`: `number` - The length of each chunk. Defaults to `1`.

### Return Value

`ChunkReturnType<T>` - An array containing chunks of the original data. The return type is automatically inferred:
- **Array/String**: Returns shallow copies (`Array<T[]>` or `string[]`).
- **Buffer/TypedArray**: Returns views sharing the same memory (`subarray`).
- **Blob/File**: Returns Blob chunks (pointers only), suitable for large file uploads.
- **ArrayBuffer**: Returns copied ArrayBuffers.

### Examples

```typescript
import { chunk } from '@lengineerc/utils';

// 1. Basic Array Usage
const arr = [1, 2, 3, 4, 5];
console.log(chunk(arr, 2)); 
// Output: [[1, 2], [3, 4], [5]]

// 2. String Usage
console.log(chunk('hello', 2)); 
// Output: ['he', 'll', 'o']

// 3. Node.js Buffer / TypedArray (Zero-copy)
const buf = Buffer.from([1, 2, 3, 4]);
const chunks = chunk(buf, 2); 
// Output: [ <Buffer 01 02>, <Buffer 03 04> ]
// Note: These chunks share memory with the original buffer.

// 4. File / Blob (Browser)
// Useful for slicing large files for upload without reading into memory
const file = new File(['content'], 'data.txt');
const fileChunks = chunk(file, 1024); 
// Output: [ Blob, Blob, ... ]
