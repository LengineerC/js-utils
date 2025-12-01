type Chunkable = any[] | string | ArrayBuffer | ArrayBufferView | Blob;
type ChunkReturnType<T extends Chunkable> = T extends string
  ? string[]
  : T extends Blob
    ? T[]
    : T extends DataView
      ? ArrayBuffer[]
      : T extends ArrayBuffer
        ? ArrayBuffer[]
        : T extends ArrayBufferView
          ? T[]
          : T extends any[]
            ? any[][]
            : never;

/**
 * 数组分块
 * @param {Chunkable} source 需要分块的数组
 * @param {number} size 块大小
 * @returns {any[][]} 分块后的数组
 */
export function chunk<T extends Chunkable>(source: T, size: number = 1): ChunkReturnType<T> {
  size = Math.max(1, Math.floor(size));
  const result: any[] = [];

  if (typeof Blob !== 'undefined' && source instanceof Blob) {
    const len = source.size;
    for (let i = 0; i < len; i += size) {
      result.push(source.slice(i, i + size));
    }
    return result as ChunkReturnType<T>;
  }

  if (ArrayBuffer.isView(source) && !(source instanceof DataView)) {
    const view = source as Uint8Array;
    const len = view.byteLength;
    for (let i = 0; i < len; i += size) {
      result.push(view.subarray(i, i + size));
    }
    return result as ChunkReturnType<T>;
  }

  if (source instanceof ArrayBuffer || source instanceof DataView) {
    const buffer = source instanceof DataView ? source.buffer : source;
    const len = buffer.byteLength;
    for (let i = 0; i < len; i += size) {
      result.push(buffer.slice(i, i + size));
    }
    return result as ChunkReturnType<T>;
  }

  if (Array.isArray(source) || typeof source === 'string') {
    const len = source.length;
    for (let i = 0; i < len; i += size) {
      result.push(source.slice(i, i + size));
    }
    return result as ChunkReturnType<T>;
  }

  throw new TypeError('Unsupported input type for chunk.');
}
