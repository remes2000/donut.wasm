import { ENTER_MOUSE_ROTATION_MODE, EXIT_MODE, EventBus } from "./event-bus.mjs";

const getCoordinates = (event) => {
  const { clientX, clientY } = event instanceof TouchEvent ? event.touches[0] : event;
  return [clientX, clientY];
}

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

    this.display.addEventListener('touchstart', this.lock);
    this.display.addEventListener('touchend', this.release);
    this.display.addEventListener('touchmove', this.rotate);
  }

  pause() {
    this.display.removeEventListener('mousedown', this.lock);
    this.display.removeEventListener('mouseup', this.release);
    this.display.removeEventListener('mousemove', this.rotate);

    this.display.removeEventListener('touchstart', this.lock);
    this.display.removeEventListener('touchend', this.release);
    this.display.removeEventListener('touchmove', this.rotate);
  }

  lock = (event) => {
    event.preventDefault();
    this.lockPoint = getCoordinates(event);
  }

  release = (event) => {
    event.preventDefault();
    this.lockPoint = null;
  }

  rotate = (event) => {
    event.preventDefault();
    if (!this.lockPoint) {
      return;
    }
    const [lockX, lockY] = this.lockPoint;
    const [clientX, clientY] = getCoordinates(event);
    const [dx, dy] = [clientX - lockX, clientY - lockY];
    this.donut.rotate(dy * this.rotationStep, dx * this.rotationStep);
    this.lockPoint = [clientX, clientY];
  }
}
