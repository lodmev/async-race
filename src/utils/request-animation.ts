import { APPROXIMATE_FRAME_TIME } from '../models/constants';

export default function animation(draw: (progress: number) => boolean) {
  let startTime: number;
  let done = false;
  let requestId: number;
  let duration: number;
  function animate(previousTimeStamp: number) {
    const timeFraction = (previousTimeStamp - startTime) / duration;
    const progress = timeFraction * APPROXIMATE_FRAME_TIME;
    done = draw(progress);
    if (!done) {
      requestId = requestAnimationFrame(animate);
    }
  }
  return {
    start(steps: number) {
      startTime = performance.now();
      duration = steps;
      requestId = requestAnimationFrame(animate);
    },
    cancel() {
      done = true;
      cancelAnimationFrame(requestId);
    },
  };
}
