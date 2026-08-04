/**
 * Cántico de Fe Music
 * V12.0 — Admin Studio
 * Public API
 */

import AdminRouter
  from './services/AdminRouter.js';

import AdminState
  from './services/AdminState.js';

import AdminStorage
  from './services/AdminStorage.js';

import renderAdminLayout
  from './components/renderAdminLayout.js';

import renderDashboard
  from './components/renderDashboard.js';

import renderSidebar
  from './components/renderSidebar.js';

import renderToolbar
  from './components/renderToolbar.js';

export {
  AdminRouter,
  AdminState,
  AdminStorage,
  renderAdminLayout,
  renderDashboard,
  renderSidebar,
  renderToolbar
};

export default {
  AdminRouter,
  AdminState,
  AdminStorage,
  renderAdminLayout,
  renderDashboard,
  renderSidebar,
  renderToolbar
};
