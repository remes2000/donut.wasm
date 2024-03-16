let memory = new WebAssembly.Memory({
  initial: 256,
  maximum: 512
});

let donutAPI;

WebAssembly.instantiateStreaming(fetch('donut.wasm'), {
  js: { mem: memory },
  env: { 
    emscripten_resize_heap: memory.grow,
  },
}).then((results) => {
  memory = results.instance.exports.memory;
  // donutAPI = {
  //   getFrame: (...args) => {
  //     const ptr = results.instance.exports.render_frame(...args);
  //     return ptr;
  //   },
  // };
  console.log(results);
  // renderFrame();
  // renderFrame = results.instance.exports.render_frame;
  // freeMemory = results.instance.exports.wasmfree;
});

const [rowsInput, colsInput, fontSizeInput, fontColorInput, distanceInput, display] = [
  document.querySelector('#rows'),
  document.querySelector('#cols'),
  document.querySelector('#fontsize'),
  document.querySelector('#fontcolor'),
  document.querySelector('#distance'),
  document.querySelector('.display pre'),
];

let settings = {
  rows: 80,
  cols: 22,
  fontSize: 12,
  fontColor: '#ffffff',
  distance: 30,
};

function updateView({ rows, cols, fontSize, fontColor, distance }) {
  rowsInput.value = rows;
  colsInput.value = cols;
  fontSizeInput.value = fontSize;
  fontColorInput.value = fontColor;
  distanceInput.value = distance;
}

function renderFrame() {
  display.innerHTML = donutAPI.getFrame();
}

updateView(settings);

fontColorInput.addEventListener('input', ({ target: { value } }) => {
  settings.fontColor = value;
  display.style.setProperty('color', value);
});

fontSizeInput.addEventListener('input', ({ target: { value } }) => {
  settings.fontSize = value;
  display.style.setProperty('font-size', `${value}px`);
});