const STORAGE_KEY =
  'cantico:queue-engine-state';

export function saveQueueState(state = {}) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(state)
    );

    return true;
  } catch (error) {
    console.error(
      '[QueueStorage] No se pudo guardar la cola:',
      error
    );

    return false;
  }
}

export function loadQueueState() {
  try {
    const storedValue =
      localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      return null;
    }

    const parsedValue =
      JSON.parse(storedValue);

    if (
      !parsedValue ||
      typeof parsedValue !== 'object'
    ) {
      return null;
    }

    return parsedValue;
  } catch (error) {
    console.error(
      '[QueueStorage] No se pudo recuperar la cola:',
      error
    );

    return null;
  }
}

export function clearQueueState() {
  try {
    localStorage.removeItem(
      STORAGE_KEY
    );

    return true;
  } catch (error) {
    console.error(
      '[QueueStorage] No se pudo borrar la cola guardada:',
      error
    );

    return false;
  }
}
