export function registerFunctionalModules(context) {
  const modules = [
    'authentication',
    'user-management',
    'dashboard',
    'cms',
    'media-library',
    'music-player',
    'playlists',
    'albums',
    'hymns',
    'devotionals',
    'seo',
    'search',
    'analytics',
    'notifications',
    'settings',
    'pwa'
  ];

  modules.forEach(name => {
    context.modules.set(name, {
      name,
      status: 'registered',
      type: 'functional'
    });
  });

  console.info('[Cántico V8.0] Functional modules registered:', modules.length);
}
