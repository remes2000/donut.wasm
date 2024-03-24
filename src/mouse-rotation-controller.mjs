import { ENTER_MOUSE_ROTATION_MODE, EXIT_MODE, EventBus } from "./event-bus.mjs";

export class MouseRotationController {
  donut;
  lockPoint;
  rotationStep = 0.008;
  display = document.querySelector('.display');

  constructor(donut) {
    this.donut = donut;
    this.listenToEventBus();
  }

  listenToEventBus() {
    EventBus.subscribe(({ type }) => {
      if (type === ENTER_MOUSE_ROTATION_MODE) {
        return this.resume();
      }
      if (type === EXIT_MODE) {
        return this.pause();
      }
    });
  }

  resume() {
    this.display.addEventListener('mousedown', this.lock);
    this.display.addEventListener('mouseup', this.release);
    this.display.addEventListener('mousemove', this.rotate);
  }

  pause() {
    this.display.removeEventListener('mousedown', this.lock);
    this.display.removeEventListener('mouseup', this.release);
    this.display.removeEventListener('mousemove', this.rotate);
  }

  lock = ({ clientX, clientY }) => {
    this.lockPoint = [clientX, clientY];
  }

  release = () => {
    this.lockPoint = null;
  }

  rotate = ({ clientX, clientY }) => {
    if (!this.lockPoint) {
      return;
    }
    const [lockX, lockY] = this.lockPoint;
    const [dx, dy] = [clientX - lockX, clientY - lockY];
    const [currentRotateX, currentRotateY, currentRotateZ] = this.donut.rotate;
    this.donut.rotate = [
      (currentRotateX + dy * this.rotationStep) % 6.28,
      (currentRotateY + dx * this.rotationStep) % 6.28,
      currentRotateZ
    ];
    this.lockPoint = [clientX, clientY];
  }
}
