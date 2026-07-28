import {
  getQueue,
  setQueue,
  clearQueue,
  getCurrentIndex,
  setCurrentIndex,
  getCurrentTrack,
  hasNextTrack,
  hasPreviousTrack,
  isRepeatEnabled,
  isShuffleEnabled
} from './QueueState.js';

export class QueueService {
  load(queue = [], startIndex = 0) {
    setQueue(queue);

    if (queue.length) {
      setCurrentIndex(startIndex);
    }

    return getCurrentTrack();
  }

  clear() {
    clearQueue();
  }

  current() {
    return getCurrentTrack();
  }

  all() {
    return getQueue();
  }

  next() {
    const queue = getQueue();

    if (!queue.length) {
      return null;
    }

    if (isShuffleEnabled()) {
      const randomIndex = Math.floor(
        Math.random() * queue.length
      );

      setCurrentIndex(randomIndex);

      return getCurrentTrack();
    }

    if (hasNextTrack()) {
      setCurrentIndex(getCurrentIndex() + 1);

      return getCurrentTrack();
    }

    if (isRepeatEnabled()) {
      setCurrentIndex(0);

      return getCurrentTrack();
    }

    return null;
  }

  previous() {
    if (!hasPreviousTrack()) {
      return null;
    }

    setCurrentIndex(getCurrentIndex() - 1);

    return getCurrentTrack();
  }

  jump(index) {
    setCurrentIndex(index);

    return getCurrentTrack();
  }
}
