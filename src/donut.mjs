export class Donut {
  donutAPI;
  preElement = document.querySelector('.display pre');
  _rotate = [6.28 / 4, 0, 0]
  rows = 80;
  cols = 22;
  _color = '#ffffff';
  _fontSize = 12;
  _thickness = 1;
  _size = 2;
  distance = 30;

  constructor(donutAPI) {
    this.donutAPI = donutAPI;
    this.render();
  }

  render() {
    const [rotateX, rotateY, rotateZ] = this._rotate;
    this.preElement.innerHTML =
      this.donutAPI.getFrame(rotateX, rotateY, rotateZ, this.rows, this.cols, this._thickness, this._size);
  }

  setDefaultState() {
    this._rotate = [6.28 / 4, 0, 0];
    this.rows = 80;
    this.cols = 22;
    this._thickness = 1;
    this._size = 2;
    this.distance = 30;
    this.render();
    this.color = '#ffffff';
    this.fontSize = 12;
  }
 
  set rotate(rotate) {
    this._rotate = rotate;
    document.querySelector('#test').innerHTML = `
      <div>X = ${this._rotate[0].toFixed(2)}</div>
      <div>Y = ${this._rotate[1].toFixed(2)}</div>
      <div>Z = ${this._rotate[2].toFixed(2)}</div>
    `
    this.render();
  }

  get rotate() {
    return this._rotate;
  }

  set color(color) {
    this._color = color;
    this.preElement.style.setProperty('color', color);
  }

  get color() {
    return this._color;
  }

  set fontSize(fontSize) {
    this._fontSize = fontSize;
    this.preElement.style.setProperty('font-size', `${fontSize}px`);
  }

  get fontSize() {
    return this._fontSize;
  }

  get thickness() {
    return this._thickness;
  }

  set thickness(thickness) {
    this._thickness = thickness;
    this.render();
  }

  get size() {
    return this._size;
  }

  set size(size) {
    this._size = size;
    this.render();
  }
}
