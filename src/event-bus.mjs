export const ENTER_LOCKED_CURSOR_MODE = 'ENTER_LOCKED_CURSOR_MODE';
export const LOCKED_CURSOR_MODE_FINISHED = 'LOCKED_CURSOR_MODE_FINISHED';
export const ENTER_MOUSE_ROTATION_MODE = 'ENTER_MOUSE_ROTATION_MODE';
export const EXIT_MODE = 'EXIT_MODE';
export const ENTER_ANIMATION_MODE = 'ENTER_ANIMATION_MODE';
export const ANIMATION_MODE_FINISHED = 'ANIMATION_MODE_FINISHED';

export class EventBus {
  static listeners = [];

  static subscribe(callback) {
    this.listeners.push(callback);
  }

  static emit(event) {
    this.listeners.forEach((listener) => listener(event));
  }
}

