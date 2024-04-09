import { FLOAT_SIZE_IN_BYTES } from "./consts.mjs";

export class DonutApi {
  wasmResult;

  constructor(wasmResult) {
    this.wasmResult = wasmResult;
  }

  getFrame(rows, cols, r1, r2, rotationAccumulator, distance) {
    const rotationAccumulatorPointer = this.arrayToFloatPointer(rotationAccumulator);
    const resultPointer = this.exports.render_frame(rotationAccumulatorPointer, cols, rows, r1, r2, distance);
    const frame = this.charPointerToString(resultPointer);

    this.exports.wasmfree(rotationAccumulatorPointer);
    this.exports.wasmfree(resultPointer);

    return frame.match(new RegExp(`.{1,${cols}}`, 'g')).join('\n');
  }

  rotateMatrix(matrix, rotateX, rotateY) {
    const matrixPointer = this.arrayToFloatPointer(matrix);
    const resultPointer = this.exports.wasmallocate(matrix.length * FLOAT_SIZE_IN_BYTES);
    this.exports.rotate(matrixPointer, rotateX, rotateY, resultPointer);

    const result = this.floatPointerToArray(resultPointer, matrix.length);

    this.exports.wasmfree(matrixPointer);
    this.exports.wasmfree(resultPointer);

    return result;
  }

  arrayToFloatPointer(array) {
    const pointer = this.exports.wasmallocate(array.length * FLOAT_SIZE_IN_BYTES);
    const floatArray = new Float32Array(this.memory.buffer, pointer);
    array.forEach((item, index) => floatArray[index] = item);
    return pointer;
  }

  floatPointerToArray(pointer, length) {
    const floatArray = new Float32Array(this.memory.buffer, pointer);
    return Array.from({ length }).map((_, index) => floatArray[index]);
  }

  charPointerToString(pointer) {
    const bytes = new Uint8Array(this.memory.buffer, pointer);
    let stringLength = 0;
    while (bytes[stringLength] !== 0) stringLength++;
    return new TextDecoder("utf8").decode(bytes.slice(0, stringLength));
  }

  get memory() {
    return this.wasmResult.instance.exports.memory;
  }

  get exports() {
    return this.wasmResult.instance.exports;
  }
}
