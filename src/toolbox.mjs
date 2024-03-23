export class Toolbox {
  donut;
  rowsInput = document.querySelector('#rows');
  colsInput = document.querySelector('#cols');
  fontSizeInput = document.querySelector('#fontsize');
  fontColorInput = document.querySelector('#fontcolor');
  distanceInput = document.querySelector('#distance');
  thicknessInput = document.querySelector('#thickness');
  sizeInput = document.querySelector('#size');

  constructor(donut) {
    this.donut = donut;
    this.initView();
    this.listenToEvents();
  }

  initView() {
    const { rows, cols, color, fontSize, distance, thickness, size } = this.donut;
    this.rowsInput.value = rows;
    this.colsInput.value = cols;
    this.fontSizeInput.value = fontSize;
    this.fontColorInput.value = color;
    this.distanceInput.value = distance;
    this.thicknessInput.value = thickness;
    this.sizeInput.value = size;
  }

  listenToEvents() {
    this.fontColorInput.addEventListener('input', ({ target: { value } }) => {
      this.donut.color = value;
    });

    this.fontSizeInput.addEventListener('input', ({ target: { value } }) => {
      this.donut.fontSize = value;
    });

    this.thicknessInput.addEventListener('input', ({ target: { value } }) => {
      this.donut.thickness = value;
    });

    this.sizeInput.addEventListener('input', ({ target: { value } }) => {
      this.donut.size = value;
    });
  }
}
