import { ENTER_ANIMATION_MODE, EXIT_MODE, EventBus } from "./event-bus.mjs";

export class AnimateController {
  donut;
  xAxisStep = 0.04;
  zAxisStep = 0.02;
  currentIntervalRef;
  intervalRate = 10;

  constructor(donut) {
    this.donut = donut;
    this.listenToEventBus();
  }

  listenToEventBus() {
    EventBus.subscribe(({ type }) => {
      if (type === ENTER_ANIMATION_MODE) {
        return this.resume();
      }
      if (type === EXIT_MODE) {
        return this.pause();
      }
    });
  }

  resume() {
    this.currentIntervalRef = setInterval(() => {
      this.updateShape();  
    }, this.intervalRate);
  }

  pause() {
    if (this.currentIntervalRef) {
      clearInterval(this.currentIntervalRef);
    }
  }

  updateShape() {
    const [currentRotateX, currentRotateY, currentRotateZ] = this.donut.rotate;
    this.donut.rotate = [
      (currentRotateX + this.xAxisStep) % 6.28,
      currentRotateY,
      (currentRotateZ + this.zAxisStep) % 6.28,
    ];
  }
}