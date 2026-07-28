const state = {
  queue: [],
  currentIndex: -1,

  repeat: false,
  shuffle: false
};

export function getQueueState() {
  return state;
}

export function getQueue() {
  return state.queue;
}

export function setQueue(queue = []) {
  state.queue = [...queue];

  if (!state.queue.length) {
    state.currentIndex = -1;
    return;
  }

  if (
    state.currentIndex < 0 ||
    state.currentIndex >= state.queue.length
  ) {
    state.currentIndex = 0;
  }
}

export function clearQueue() {
  state.queue = [];
  state.currentIndex = -1;
}

export function getCurrentIndex() {
  return state.currentIndex;
}

export function setCurrentIndex(index) {
  if (
    index < 0 ||
    index >= state.queue.length
  ) {
    return;
  }

  state.currentIndex = index;
}

export function getCurrentTrack() {
  return state.queue[state.currentIndex] || null;
}

export function hasNextTrack() {
  return (
    state.currentIndex <
    state.queue.length - 1
  );
}

export function hasPreviousTrack() {
  return state.currentIndex > 0;
}

export function isRepeatEnabled() {
  return state.repeat;
}

export function setRepeat(enabled) {
  state.repeat = Boolean(enabled);
}

export function isShuffleEnabled() {
  return state.shuffle;
}

export function setShuffle(enabled) {
  state.shuffle = Boolean(enabled);
}
