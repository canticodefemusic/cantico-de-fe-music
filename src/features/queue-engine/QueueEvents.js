export const QueueEventNames = {
  QUEUE_LOADED: 'cantico:queue-loaded',
  QUEUE_CLEARED: 'cantico:queue-cleared',
  TRACK_CHANGED: 'cantico:queue-track-changed',
  REPEAT_CHANGED: 'cantico:queue-repeat-changed',
  SHUFFLE_CHANGED: 'cantico:queue-shuffle-changed'
};

export function dispatchQueueEvent(
  eventName,
  detail = {}
) {
  window.dispatchEvent(
    new CustomEvent(eventName, {
      detail
    })
  );
}

export function onQueueEvent(
  eventName,
  listener
) {
  if (typeof listener !== 'function') {
    return () => {};
  }

  window.addEventListener(
    eventName,
    listener
  );

  return () => {
    window.removeEventListener(
      eventName,
      listener
    );
  };
}
