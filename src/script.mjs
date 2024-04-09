import { DonutApi } from './donut-api.mjs';
import { Donut } from './donut.mjs';
import { Toolbox } from './toolbox.mjs';
import { MouseRotationController } from './mouse-rotation-controller.mjs';
import { LockedRotationController } from './locked-rotation-controller.mjs';
import { AnimateController } from './animate-controller.mjs';

const memory = new WebAssembly.Memory({
  initial: 256,
  maximum: 512
});

WebAssembly.instantiateStreaming(fetch('src/wasm/donut.wasm'), {
  js: { mem: memory },
  env: { 
    emscripten_resize_heap: memory.grow,
  },
}).then((results) => {
  const donutAPI = new DonutApi(results);
  const donut = new Donut(donutAPI);
  new MouseRotationController(donut)
  new LockedRotationController(donut)
  new AnimateController(donut);
  new Toolbox(donut);
});