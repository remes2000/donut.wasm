import { DonutApi } from './donut-api.mjs';
import { Donut } from './donut.mjs';
import { Toolbox } from './toolbox.mjs';
import { RotationController } from './rotation-controller.mjs';

let memory = new WebAssembly.Memory({
  initial: 256,
  maximum: 512
});

WebAssembly.instantiateStreaming(fetch('src/wasm/donut.wasm'), {
  js: { mem: memory },
  env: { 
    emscripten_resize_heap: memory.grow,
  },
}).then((results) => {
  memory = results.instance.exports.memory;
  const donutAPI = new DonutApi(results);
  const donut = new Donut(donutAPI);
  new Toolbox(donut);
  new RotationController(donut);
});