import { applicationState } from '../core/state/index.js';
import { bootstrapCanticoApp } from '../bootstrap/bootstrap.js';

document.addEventListener('DOMContentLoaded', async () => {
  applicationState.updateSection(
    'application',
    {
      status: 'initializing',
      startedAt: new Date().toISOString()
    },
    {
      source: 'app',
      action: 'bootstrap-start'
    }
  );

  try {
    await bootstrapCanticoApp({
      rootSelector: '#app',
      environment: 'production'
    });

    applicationState.updateSection(
      'application',
      {
        status: 'ready',
        rootSelector: '#app',
        environment: 'production',
        initializedAt: new Date().toISOString()
      },
      {
        source: 'app',
        action: 'bootstrap-complete'
      }
    );
  } catch (error) {
    applicationState.updateSection(
      'application',
      {
        status: 'error',
        message: error?.message ?? 'Unknown error'
      },
      {
        source: 'app',
        action: 'bootstrap-error'
      }
    );

    throw error;
  }
});
