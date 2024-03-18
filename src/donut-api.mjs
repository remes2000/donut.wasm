export class DonutApi {
  wasmResult;

  constructor(wasmResult) {
    this.wasmResult = wasmResult;
  }

  getFrame(rotateX, rotateY, rotateZ, rows, cols) {
    const pointer = this.exports.render_frame(rotateX, rotateY, rotateZ, rows, cols);
    
    const bytes = new Uint8Array(this.memory.buffer, pointer);
    let stringLength = 0;
    while (bytes[stringLength] != 0) stringLength++;
    const frame = new TextDecoder("utf8").decode(bytes.slice(0, stringLength));

    this.exports.wasmfree(pointer);
    return frame;
  }

  get memory() {
    return this.wasmResult.instance.exports.memory;
  }

  get exports() {
    return this.wasmResult.instance.exports;
  }
}
