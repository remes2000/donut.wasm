export class Donut {
  donutAPI;
  preElement = document.querySelector('.display pre');
  _rotate = [6.28 / 4, 0, 0]
  rows = 80;
  cols = 22;
  _color = '#ffffff';
  _fontSize = 12;
  distance = 30;

  constructor(donutAPI) {
    this.donutAPI = donutAPI;
    this.render();
  }

  render() {
    const [rotateX, rotateY, rotateZ] = this._rotate;
    this.preElement.innerHTML =
      this.donutAPI.getFrame(rotateX, rotateY, rotateZ, this.rows, this.cols);
  }
 
  set rotate(rotate) {
    this._rotate = rotate;
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
}
