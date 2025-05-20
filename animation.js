class DiskAnimation {
  constructor() {
    this.GRAVITY = 9.81;
    this.CELL_HEIGHT = 80; // pixels
    this.FPS = 60;
    this.ANIMATION_DURATION = 0.5;
    this.BOUNCE_DAMPING = 0.6; // Reduces bounce height
    this.frames = this.generateAnimationFrames();
  }

  calculateDiskPosition(time) {
    const initialVelocity = 0;
    const initialY = -6 * this.CELL_HEIGHT; // Start 6 cells above

    let position =
      initialY +
      initialVelocity * time +
      0.5 * this.GRAVITY * this.CELL_HEIGHT * Math.pow(time, 2);

    // Add bounce effect when disk hits bottom
    if (position >= 0) {
      const timeAfterImpact = time % (this.ANIMATION_DURATION / 2);
      const bounceHeight = Math.abs(position) * this.BOUNCE_DAMPING;
      position = -bounceHeight * Math.sin(timeAfterImpact * Math.PI);
    }

    return Math.min(position, 0);
  }

  generateAnimationFrames() {
    const frames = [];
    const timeStep = 1 / this.FPS;

    for (let t = 0; t <= this.ANIMATION_DURATION; t += timeStep) {
      frames.push({
        time: t,
        y: this.calculateDiskPosition(t),
      });
    }

    return frames;
  }

  getFrameAtTime(time) {
    const frameIndex = Math.floor(time * this.FPS);
    return frameIndex < this.frames.length
      ? this.frames[frameIndex]
      : this.frames[this.frames.length - 1];
  }
}

export default DiskAnimation;
