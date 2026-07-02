export function registerCoreEngines(context) {
  const coreEngines = [
    'router',
    'state',
    'event-bus',
    'module-loader',
    'configuration',
    'logger',
    'cache',
    'service-container',
    'dependency-injection',
    'api',
    'theme',
    'component',
    'layout'
  ];

  coreEngines.forEach(name => {
    context.services.set(name, {
      name,
      status: 'registered',
      type: 'core'
    });
  });

  console.info('[Cántico V8.0] Core engines registered:', coreEngines.length);
}
