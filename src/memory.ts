type MemoryType =
  | Int8Array
  | Int16Array
  | Int32Array
  | Uint8Array
  | Uint16Array
  | Uint32Array
  | Float32Array
  | Float64Array;

/**
 * Fill specified range of wasm memory with single value.
 *
 * @param memory target awsm memory
 * @param offset start offset of range
 * @param size number of values to fill from offset
 * @param fillValue value to fill memory
 */
export function fill(memory: MemoryType, offset: number, size: number, fillValue: number) {
  memory.fill(fillValue, offset, offset + size);
}

/**
 * Get ranged data from wasm memory.
 *
 * @param memory target wasm memory
 * @param offset start offset of range
 * @param size number of values to get from offset
 * @returns result of ranged data as `TypedArray`
 */
export function getData(memory: MemoryType, offset: number, size: number) {
  return memory.subarray(offset, offset + size);
}

/**
 * Allocate wasm memory for an array of num objects of size and initialize allocated memory range to zero-fill.
 *
 * @param num number of objects
 * @param type size of object
 * @returns allocated memory pointer
 */
export function calloc(num: number, type: number) {
  const ptr = window.FPDF.wasmExports.malloc(num * type);
  fill(window.FPDF.HEAP8, ptr, num * type, 0);

  return ptr;
}
