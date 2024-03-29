export class Donut {
  donutAPI;
  preElement = document.querySelector('.display pre');
  _rows;
  _cols;
  _color;
  _fontSize;
  _thickness;
  _size;
  _distance;
  _rotationAccumulator;

  constructor(donutAPI) {
    this.donutAPI = donutAPI;
    this.setDefaultState();
  }

  render() {
    this.preElement.innerHTML =
      this.donutAPI.getFrame(this._rows, this._cols, this._thickness, this._size, this._rotationAccumulator, this._distance);
  }

  setDefaultState() {
    this._rows = 80;
    this._cols = 22;
    this._thickness = 1;
    this._size = 2;
    this._distance = 5;
    this._rotationAccumulator = this.donutAPI.rotateMatrix([
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    ], 6.28 / 4, 0);
    this.render();

    this.color = '#ffffff';
    this.fontSize = 12;
  }

  rotate(xRotateAngle, yRotateAngle) {
    this._rotationAccumulator = this.donutAPI.rotateMatrix(this._rotationAccumulator, xRotateAngle, yRotateAngle);
    this.render();
  }

  get color() {
    return this._color;
  }

  get fontSize() {
    return this._fontSize;
  }

  get thickness() {
    return this._thickness;
  }

  get size() {
    return this._size;
  }

  get rows() {
    return this._rows;
  }

  get cols() {
    return this._cols;
  }

  get distance() {
    return this._distance;
  }

  set color(color) {
    this._color = color;
    this.preElement.style.setProperty('color', color);
  }

  set fontSize(fontSize) {
    this._fontSize = fontSize;
    this.preElement.style.setProperty('font-size', `${fontSize}px`);
  }

  set thickness(thickness) {
    this._thickness = thickness;
    this.render();
  }

  set size(size) {
    this._size = size;
    this.render();
  }
  
  set rows(rows) {
    this._rows = rows;
    this.render();
  }

  set cols(cols) {
    this._cols = cols;
    this.render();
  }

  set distance(distance) {
    this._distance = distance;
    this.render();
  }
}
