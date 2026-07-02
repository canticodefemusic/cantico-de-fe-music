export function resolveRoute() {
  const params = new URLSearchParams(window.location.search);
  const page = params.get('page') || 'home';
  const id = params.get('id') || null;

  return {
    page,
    id,
    path: window.location.pathname,
    query: Object.fromEntries(params.entries())
  };
}
