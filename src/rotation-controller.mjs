export class RotationController {
  donut;
  lockPoint;
  rotationStep = 0.008;
  display = document.querySelector('.display');

  constructor(donut) {
    this.donut = donut;
    this.listenToEvents();
  }

  listenToEvents() {
    this.display.addEventListener('mousedown', this.lock.bind(this));
    this.display.addEventListener('mouseup', this.release.bind(this));
    this.display.addEventListener('mousemove', this.rotate.bind(this));
  }

  lock({ clientX, clientY }) {
    this.lockPoint = [clientX, clientY];
  }

  release() {
    this.lockPoint = null;
  }

  rotate({ clientX, clientY }) {
    if (!this.lockPoint) {
      return;
    }
    const [lockX, lockY] = this.lockPoint;
    const [dx, dy] = [clientX - lockX, clientY - lockY];
    const d = Math.hypot(dx, dy);
    const [currentRotateX, currentRotateY, currentRotateZ] = this.donut.rotate;
    this.donut.rotate = [
      currentRotateX + (dy > 0 ? 1 : -1) * (d * this.rotationStep),
      currentRotateY + (dx > 0 ? 1 : -1) * (d * this.rotationStep),
      currentRotateZ
    ];
    this.lockPoint = [clientX, clientY];
  }
}
