import { registerCoreEngines } from '../integrations/core/registerCoreEngines.js';
import { registerFunctionalModules } from '../integrations/modules/registerFunctionalModules.js';
import { StartupManager } from '../startup/StartupManager.js';

export async function bootstrapCanticoApp(options = {}) {
  const context = {
    appName: 'Cántico de Fe Music',
    version: '8.0',
    environment: options.environment || 'production',
    rootSelector: options.rootSelector || '#app',
    services: new Map(),
    modules: new Map(),
    errors: []
  };

  try {
    registerCoreEngines(context);
    registerFunctionalModules(context);

    const startup = new StartupManager(context);
    await startup.start();

    return context;
  } catch (error) {
    context.errors.push(error);
    console.error('[Cántico V8.0] Bootstrap failed:', error);
    return context;
  }
}
