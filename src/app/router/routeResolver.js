import { applicationState } from '../../core/state/index.js';

export function resolveRoute() {
  const params = new URLSearchParams(window.location.search);
  const page = params.get('page') || 'home';
  const id = params.get('id') || null;

  const route = {
    page,
    id,
    path: window.location.pathname,
    query: Object.fromEntries(params.entries())
  };

  applicationState.updateSection(
    'router',
    {
      currentRoute: route,
      currentPage: page,
      currentId: id,
      path: route.path,
      query: route.query
    },
    {
      source: 'route-resolver',
      action: 'resolve-route'
    }
  );

  return route;
}
