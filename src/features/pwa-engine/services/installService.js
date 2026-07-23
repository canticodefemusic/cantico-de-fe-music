let deferredInstallPrompt = null;

function isAppInstalled() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

export function canInstallApp() {
  return Boolean(deferredInstallPrompt);
}

export async function installApp() {
  if (!deferredInstallPrompt) {
    return {
      available: false,
      outcome: 'unavailable'
    };
  }

  deferredInstallPrompt.prompt();

  const choiceResult = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;

  window.dispatchEvent(
    new CustomEvent('cantico:pwa-install-result', {
      detail: {
        outcome: choiceResult.outcome
      }
    })
  );

  return {
    available: true,
    outcome: choiceResult.outcome
  };
}

export function initPwaInstallService() {
  if (isAppInstalled()) {
    document.documentElement.dataset.pwaInstalled = 'true';
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;

    document.documentElement.dataset.pwaInstallAvailable = 'true';

    window.dispatchEvent(
      new CustomEvent('cantico:pwa-install-available')
    );
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;

    document.documentElement.dataset.pwaInstalled = 'true';
    delete document.documentElement.dataset.pwaInstallAvailable;

    window.dispatchEvent(
      new CustomEvent('cantico:pwa-installed')
    );

    console.log('Cántico de Fe Music fue instalado correctamente.');
  });
}
