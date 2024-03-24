export class DonutApi {
  wasmResult;

  constructor(wasmResult) {
    this.wasmResult = wasmResult;
  }

  getFrame(rotateX, rotateY, rotateZ, rows, cols, r1, r2) {
    const pointer = this.exports.render_frame(rotateX, rotateY, rotateZ, rows, cols, r1, r2);
    
    const bytes = new Uint8Array(this.memory.buffer, pointer);
    let stringLength = 0;
    while (bytes[stringLength] != 0) stringLength++;
    const frame = new TextDecoder("utf8").decode(bytes.slice(0, stringLength));

    this.exports.wasmfree(pointer);
    console.log(frame.length);

    const regexp = new RegExp(`.{1,${rows}}`, 'g');
    return frame.match(regexp).join('\n');
  }

  get memory() {
    return this.wasmResult.instance.exports.memory;
  }

  get exports() {
    return this.wasmResult.instance.exports;
  }
}
