/**
 * Cántico de Fe Music
 * V9.9 — Application State Engine
 *
 * Estado central de toda la aplicación.
 */

const initialState = {
  player: {
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    muted: false,
    repeatMode: 'off',
    shuffleEnabled: false
  },

  queue: {
    tracks: [],
    currentIndex: -1
  },

  favorites: {
    hymnIds: []
  },

  history: {
    entries: []
  },

  playlists: {
    items: []
  },

  recommendations: {
    items: [],
    relatedItems: []
  },

  app: {
    initialized: false,
    activeView: 'home',
    loading: false,
    error: null
  }
};

function cloneValue(value) {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
}

function isObject(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value)
  );
}

function mergeState(currentState, partialState) {
  const nextState = {
    ...currentState
  };

  Object.entries(partialState).forEach(([key, value]) => {
    if (isObject(value) && isObject(currentState[key])) {
      nextState[key] = {
        ...currentState[key],
        ...value
      };

      return;
    }

    nextState[key] = value;
  });

  return nextState;
}

class ApplicationState {
  constructor(defaultState = initialState) {
    this.initialState = cloneValue(defaultState);
    this.state = cloneValue(defaultState);
    this.listeners = new Set();
  }

  getState() {
    return cloneValue(this.state);
  }

  getSection(sectionName) {
    if (!Object.prototype.hasOwnProperty.call(this.state, sectionName)) {
      return null;
    }

    return cloneValue(this.state[sectionName]);
  }

  setState(partialState, metadata = {}) {
    if (!isObject(partialState)) {
      console.warn(
        '[ApplicationState] setState esperaba un objeto.',
        partialState
      );

      return this.getState();
    }

    const previousState = this.getState();

    this.state = mergeState(this.state, partialState);

    const nextState = this.getState();

    this.notify({
      previousState,
      nextState,
      metadata
    });

    return nextState;
  }

  updateSection(sectionName, sectionState, metadata = {}) {
    if (!Object.prototype.hasOwnProperty.call(this.state, sectionName)) {
      console.warn(
        `[ApplicationState] La sección "${sectionName}" no existe.`
      );

      return this.getState();
    }

    return this.setState(
      {
        [sectionName]: sectionState
      },
      {
        ...metadata,
        section: sectionName
      }
    );
  }

  update(updater, metadata = {}) {
    if (typeof updater !== 'function') {
      console.warn(
        '[ApplicationState] update esperaba una función.'
      );

      return this.getState();
    }

    const currentState = this.getState();
    const partialState = updater(currentState);

    return this.setState(partialState, metadata);
  }

  subscribe(listener) {
    if (typeof listener !== 'function') {
      console.warn(
        '[ApplicationState] subscribe esperaba una función.'
      );

      return () => {};
    }

    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  subscribeToSection(sectionName, listener) {
    if (typeof listener !== 'function') {
      console.warn(
        '[ApplicationState] subscribeToSection esperaba una función.'
      );

      return () => {};
    }

    let previousSection = this.getSection(sectionName);

    return this.subscribe(({ nextState, metadata }) => {
      const nextSection = cloneValue(nextState[sectionName]);

      const previousSerialized = JSON.stringify(previousSection);
      const nextSerialized = JSON.stringify(nextSection);

      if (previousSerialized === nextSerialized) {
        return;
      }

      const oldSection = previousSection;

      previousSection = cloneValue(nextSection);

      listener(nextSection, oldSection, metadata);
    });
  }

  reset(metadata = {}) {
    const previousState = this.getState();

    this.state = cloneValue(this.initialState);

    const nextState = this.getState();

    this.notify({
      previousState,
      nextState,
      metadata: {
        ...metadata,
        action: 'reset'
      }
    });

    return nextState;
  }

  resetSection(sectionName, metadata = {}) {
    if (
      !Object.prototype.hasOwnProperty.call(
        this.initialState,
        sectionName
      )
    ) {
      console.warn(
        `[ApplicationState] La sección "${sectionName}" no existe.`
      );

      return this.getState();
    }

    return this.setState(
      {
        [sectionName]: cloneValue(
          this.initialState[sectionName]
        )
      },
      {
        ...metadata,
        action: 'reset-section',
        section: sectionName
      }
    );
  }

  notify(change) {
    this.listeners.forEach(listener => {
      try {
        listener(change);
      } catch (error) {
        console.error(
          '[ApplicationState] Error en un suscriptor:',
          error
        );
      }
    });
  }
}

export const applicationState = new ApplicationState();

export { ApplicationState, initialState };
