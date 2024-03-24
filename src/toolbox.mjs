import { EventBus, LOCKED_CURSOR_MODE_FINISHED, ENTER_LOCKED_CURSOR_MODE, ENTER_MOUSE_ROTATION_MODE, EXIT_MODE, ENTER_ANIMATION_MODE } from "./event-bus.mjs";

export class Toolbox {
  donut;
  rowsInput = document.querySelector('#rows');
  colsInput = document.querySelector('#cols');
  fontSizeInput = document.querySelector('#fontsize');
  fontColorInput = document.querySelector('#fontcolor');
  distanceInput = document.querySelector('#distance');
  thicknessInput = document.querySelector('#thickness');
  sizeInput = document.querySelector('#size');
  lockCursorButton = document.querySelector('#lockcursor');
  animateButton = document.querySelector('#animate');

  constructor(donut) {
    this.donut = donut;
    this.initView();
    this.listenToDomEvents();
    this.listenToEventBus();
    EventBus.emit({ type: ENTER_MOUSE_ROTATION_MODE });
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

  listenToDomEvents() {
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

    this.lockCursorButton.addEventListener('click', () => {
      EventBus.emit({ type: EXIT_MODE });
      EventBus.emit({ type: ENTER_LOCKED_CURSOR_MODE });
    });

    this.animateButton.addEventListener('click', () => {
      EventBus.emit({ type: EXIT_MODE });
      EventBus.emit({ type: ENTER_ANIMATION_MODE });
    });
  }

  listenToEventBus() {
    EventBus.subscribe(({ type }) => {
      if (type === LOCKED_CURSOR_MODE_FINISHED) {
        return EventBus.emit({ type: ENTER_MOUSE_ROTATION_MODE });
      }
    });
  }
}
