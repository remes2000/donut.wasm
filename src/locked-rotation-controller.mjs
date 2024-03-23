export class LockedRotationController {
  donut;
  display = document.querySelector('.display');
  rotationStep = 0.008;

  constructor(donut) {
    this.donut = donut;
    document.addEventListener('pointerlockchange', this.listenToLockState);
  }

  async resume() {
    try {
      await this.display.requestPointerLock();
    } catch (err) {
      console.error('Cannot lock pointer event', err);
    }
  }

  listenToLockState = () => {
    if (document.pointerLockElement === this.display) {
      document.addEventListener('mousemove', this.updatePosition);
    } else {
      document.removeEventListener('mousemove', this.updatePosition);
    }
  }

  updatePosition = ({ movementX, movementY }) => {
    const [currentRotateX, currentRotateY, currentRotateZ] = this.donut.rotate;
    this.donut.rotate = [
      (currentRotateX + movementY * this.rotationStep) % 6.28,
      (currentRotateY + movementX * this.rotationStep) % 6.28,
      currentRotateZ
    ];
  }
}
