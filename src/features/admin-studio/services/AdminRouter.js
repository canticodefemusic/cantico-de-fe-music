/**
 * Cántico de Fe Music
 * V12.0 — Admin Studio Router
 */

import AdminState from './AdminState.js';

const DEFAULT_SECTION =
  'dashboard';

const VALID_SECTIONS = [
  'dashboard',
  'hymns',
  'albums',
  'videos',
  'devotionals',
  'media',
  'settings'
];

function normalizeSection(section) {
  const value =
    String(section || '')
      .trim()
      .toLowerCase();

  return VALID_SECTIONS.includes(value)
    ? value
    : DEFAULT_SECTION;
}

const AdminRouter = {
  getCurrentSection() {
    return AdminState
      .getState()
      .section;
  },

  navigate(section) {
    const target =
      normalizeSection(section);

    if (
      target ===
      this.getCurrentSection()
    ) {
      return;
    }

    AdminState.setSection(target);

    window.dispatchEvent(
      new CustomEvent(
        'cantico:admin-route-change',
        {
          detail: {
            section: target
          }
        }
      )
    );
  },

  is(section) {
    return (
      normalizeSection(section) ===
      this.getCurrentSection()
    );
  },

  getSections() {
    return [
      ...VALID_SECTIONS
    ];
  }
};

export default AdminRouter;
