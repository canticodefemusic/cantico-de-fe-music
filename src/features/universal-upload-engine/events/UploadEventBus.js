export class UploadEventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(eventName, callback) {
    if (
      !eventName ||
      typeof callback !== 'function'
    ) {
      return () => {};
    }

    if (!this.listeners.has(eventName)) {
      this.listeners.set(
        eventName,
        new Set()
      );
    }

    const callbacks =
      this.listeners.get(eventName);

    callbacks.add(callback);

    return () => {
      this.off(
        eventName,
        callback
      );
    };
  }

  once(eventName, callback) {
    if (
      !eventName ||
      typeof callback !== 'function'
    ) {
      return () => {};
    }

    const unsubscribe =
      this.on(
        eventName,
        payload => {
          unsubscribe();
          callback(payload);
        }
      );

    return unsubscribe;
  }

  off(eventName, callback) {
    const callbacks =
      this.listeners.get(eventName);

    if (!callbacks) {
      return false;
    }

    const removed =
      callbacks.delete(callback);

    if (callbacks.size === 0) {
      this.listeners.delete(
        eventName
      );
    }

    return removed;
  }

  emit(eventName, payload = null) {
    const callbacks =
      this.listeners.get(eventName);

    if (!callbacks) {
      return;
    }

    [...callbacks].forEach(
      callback => {
        try {
          callback(payload);
        } catch (error) {
          console.error(
            `[UploadEventBus] Error in "${eventName}" listener:`,
            error
          );
        }
      }
    );
  }

  clear(eventName = null) {
    if (eventName) {
      this.listeners.delete(
        eventName
      );

      return;
    }

    this.listeners.clear();
  }
}

export const uploadEventBus =
  new UploadEventBus();
