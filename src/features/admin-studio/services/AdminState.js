/**
 * Cántico de Fe Music
 * V12.0 — Admin Studio State
 */

const listeners = new Set();

const state = {
  section: 'dashboard',
  selectedItem: null,
  dirty: false,
  loading: false,
  saving: false,
  search: '',
  filters: {},
  lastSavedAt: null
};

function clone(value) {
  return JSON.parse(
    JSON.stringify(value)
  );
}

function emit() {
  const snapshot = clone(state);

  listeners.forEach(listener => {
    try {
      listener(snapshot);
    } catch (error) {
      console.error(error);
    }
  });

  window.dispatchEvent(
    new CustomEvent(
      'cantico:admin-state-change',
      {
        detail: snapshot
      }
    )
  );
}

const AdminState = {
  getState() {
    return clone(state);
  },

  subscribe(listener) {
    if (typeof listener !== 'function') {
      return () => {};
    }

    listeners.add(listener);

    listener(clone(state));

    return () => {
      listeners.delete(listener);
    };
  },

  setSection(section) {
    state.section = section;
    emit();
  },

  setSelectedItem(id) {
    state.selectedItem = id;
    emit();
  },

  setDirty(value = true) {
    state.dirty = Boolean(value);
    emit();
  },

  setLoading(value = true) {
    state.loading = Boolean(value);
    emit();
  },

  setSaving(value = true) {
    state.saving = Boolean(value);
    emit();
  },

  setSearch(text = '') {
    state.search = String(text);
    emit();
  },

  setFilters(filters = {}) {
    state.filters = {
      ...filters
    };

    emit();
  },

  markSaved() {
    state.dirty = false;
    state.saving = false;
    state.lastSavedAt =
      new Date().toISOString();

    emit();
  },

  reset() {
    state.section = 'dashboard';
    state.selectedItem = null;
    state.dirty = false;
    state.loading = false;
    state.saving = false;
    state.search = '';
    state.filters = {};
    state.lastSavedAt = null;

    emit();
  }
};

export default AdminState;
