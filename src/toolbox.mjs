export class Toolbox {
  donut;
  rowsInput = document.querySelector('#rows');
  colsInput = document.querySelector('#cols');
  fontSizeInput = document.querySelector('#fontsize');
  fontColorInput = document.querySelector('#fontcolor');
  distanceInput = document.querySelector('#distance');

  constructor(donut) {
    this.donut = donut;
    this.initView();
    this.listenToEvents();
  }

  initView() {
    const { rows, cols, color, fontSize, distance } = this.donut;
    this.rowsInput.value = rows;
    this.colsInput.value = cols;
    this.fontSizeInput.value = fontSize;
    this.fontColorInput.value = color;
    this.distanceInput.value = distance;
  }

  listenToEvents() {
    this.fontColorInput.addEventListener('input', ({ target: { value } }) => {
      this.donut.color = value;
    });

    this.fontSizeInput.addEventListener('input', ({ target: { value } }) => {
      this.donut.fontSize = value;
    });
  }
}
