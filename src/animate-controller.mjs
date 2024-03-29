import { ENTER_ANIMATION_MODE, EXIT_MODE, ANIMATION_MODE_FINISHED, EventBus } from "./event-bus.mjs";

export class AnimateController {
  donut;
  display = document.querySelector('.display');
  xAxisStep = 0.04;
  yAxisStep = 0.02;
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
    this.display.addEventListener('mousedown', this.endAnimation);
  }

  pause() {
    if (this.currentIntervalRef) {
      clearInterval(this.currentIntervalRef);
    }
    this.display.removeEventListener('mousedown', this.endAnimation);
  }

  endAnimation = () => {
    this.pause();
    EventBus.emit({ type: ANIMATION_MODE_FINISHED });
  }

  updateShape() {
    this.donut.rotate(this.xAxisStep, this.yAxisStep);
  }
}