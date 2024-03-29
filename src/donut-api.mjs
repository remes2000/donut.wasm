export class DonutApi {
  wasmResult;

  constructor(wasmResult) {
    this.wasmResult = wasmResult;
  }

  getFrame(rows, cols, r1, r2, rotationAccumulator, distance) {
    const FLOAT_SIZE_IN_BYTES = 4;
    const rotationAccumulatorPointer = this.exports.wasmallocate(rotationAccumulator.length * FLOAT_SIZE_IN_BYTES);
    const accumulator = new Float32Array(this.memory.buffer, rotationAccumulatorPointer);
    rotationAccumulator.forEach((_, index) => accumulator[index] = rotationAccumulator[index]);

    const pointer = this.exports.render_frame(rotationAccumulatorPointer, cols, rows, r1, r2, distance);
    this.exports.wasmfree(rotationAccumulatorPointer);
    
    const bytes = new Uint8Array(this.memory.buffer, pointer);
    let stringLength = 0;
    while (bytes[stringLength] != 0) stringLength++;
    const frame = new TextDecoder("utf8").decode(bytes.slice(0, stringLength));

    this.exports.wasmfree(pointer);

    const regexp = new RegExp(`.{1,${cols}}`, 'g');
    return frame.match(regexp).join('\n');
  }

  rotateMatrix(matrix, rotateX, rotateY) {
    const result = [];
    const FLOAT_SIZE_IN_BYTES = 4;
    const matrixPointer = this.exports.wasmallocate(matrix.length * FLOAT_SIZE_IN_BYTES);
    const matrixFloatArray = new Float32Array(this.memory.buffer, matrixPointer);
    const resultPointer = this.exports.wasmallocate(matrix.length * FLOAT_SIZE_IN_BYTES);
    const resultFloatArray = new Float32Array(this.memory.buffer, resultPointer);
    matrix.forEach((_, index) => matrixFloatArray[index] = matrix[index]);
    this.exports.rotate(matrixPointer, rotateX, rotateY, resultPointer);

    for (let i = 0; i < 9; i++) {
      result.push(resultFloatArray[i]);
    }

    this.exports.wasmfree(matrixPointer);
    this.exports.wasmfree(resultPointer);

    return result;
  }

  get memory() {
    return this.wasmResult.instance.exports.memory;
  }

  get exports() {
    return this.wasmResult.instance.exports;
  }
}
