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
  setRepeat,
  isShuffleEnabled,
  setShuffle
} from './QueueState.js';

import {
  saveQueueState,
  loadQueueState,
  clearQueueState
} from './QueueStorage.js';

import {
  QueueEventNames,
  dispatchQueueEvent
} from './QueueEvents.js';

function createStateSnapshot() {
  return {
    queue: getQueue(),
    currentIndex: getCurrentIndex(),
    repeat: isRepeatEnabled(),
    shuffle: isShuffleEnabled()
  };
}

function persistState() {
  saveQueueState(
    createStateSnapshot()
  );
}

export class QueueService {
  load(queue = [], startIndex = 0) {
    const safeQueue = Array.isArray(queue)
      ? queue.filter(Boolean)
      : [];

    setQueue(safeQueue);

    if (safeQueue.length) {
      const safeIndex =
        Number.isInteger(startIndex) &&
        startIndex >= 0 &&
        startIndex < safeQueue.length
          ? startIndex
          : 0;

      setCurrentIndex(safeIndex);
    }

    persistState();

    dispatchQueueEvent(
      QueueEventNames.QUEUE_LOADED,
      createStateSnapshot()
    );

    return getCurrentTrack();
  }

  restore() {
    const savedState = loadQueueState();

    if (
      !savedState ||
      !Array.isArray(savedState.queue)
    ) {
      return null;
    }

    setQueue(
      savedState.queue.filter(Boolean)
    );

    if (getQueue().length) {
      const savedIndex =
        Number.isInteger(savedState.currentIndex)
          ? savedState.currentIndex
          : 0;

      const safeIndex =
        savedIndex >= 0 &&
        savedIndex < getQueue().length
          ? savedIndex
          : 0;

      setCurrentIndex(safeIndex);
    }

    setRepeat(savedState.repeat === true);
    setShuffle(savedState.shuffle === true);

    dispatchQueueEvent(
      QueueEventNames.QUEUE_LOADED,
      createStateSnapshot()
    );

    return getCurrentTrack();
  }

  clear() {
    clearQueue();
    clearQueueState();

    dispatchQueueEvent(
      QueueEventNames.QUEUE_CLEARED,
      createStateSnapshot()
    );
  }

  current() {
    return getCurrentTrack();
  }

  all() {
    return [...getQueue()];
  }

  index() {
    return getCurrentIndex();
  }

  next() {
    const queue = getQueue();

    if (!queue.length) {
      return null;
    }

    if (isShuffleEnabled()) {
      let randomIndex = getCurrentIndex();

      if (queue.length > 1) {
        while (
          randomIndex === getCurrentIndex()
        ) {
          randomIndex = Math.floor(
            Math.random() * queue.length
          );
        }
      }

      setCurrentIndex(randomIndex);

      return this.emitTrackChange();
    }

    if (hasNextTrack()) {
      setCurrentIndex(
        getCurrentIndex() + 1
      );

      return this.emitTrackChange();
    }

    if (isRepeatEnabled()) {
      setCurrentIndex(0);

      return this.emitTrackChange();
    }

    return null;
  }

  previous() {
    const queue = getQueue();

    if (!queue.length) {
      return null;
    }

    if (hasPreviousTrack()) {
      setCurrentIndex(
        getCurrentIndex() - 1
      );

      return this.emitTrackChange();
    }

    if (isRepeatEnabled()) {
      setCurrentIndex(
        queue.length - 1
      );

      return this.emitTrackChange();
    }

    return null;
  }

  jump(index) {
    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index >= getQueue().length
    ) {
      return null;
    }

    setCurrentIndex(index);

    return this.emitTrackChange();
  }

  setRepeat(enabled) {
    setRepeat(enabled);
    persistState();

    dispatchQueueEvent(
      QueueEventNames.REPEAT_CHANGED,
      {
        enabled: isRepeatEnabled()
      }
    );

    return isRepeatEnabled();
  }

  toggleRepeat() {
    return this.setRepeat(
      !isRepeatEnabled()
    );
  }

  setShuffle(enabled) {
    setShuffle(enabled);
    persistState();

    dispatchQueueEvent(
      QueueEventNames.SHUFFLE_CHANGED,
      {
        enabled: isShuffleEnabled()
      }
    );

    return isShuffleEnabled();
  }

  toggleShuffle() {
    return this.setShuffle(
      !isShuffleEnabled()
    );
  }

  emitTrackChange() {
    const track = getCurrentTrack();

    persistState();

    dispatchQueueEvent(
      QueueEventNames.TRACK_CHANGED,
      {
        track,
        currentIndex: getCurrentIndex(),
        queue: [...getQueue()]
      }
    );

    return track;
  }
}
