export function initShareButtons() {
  document.querySelectorAll('[data-hymn-copy-link]').forEach(button => {
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);

        const originalText = button.textContent;
        button.textContent = '✓ Enlace copiado';
        button.disabled = true;

        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
        }, 2000);
      } catch (error) {
        console.error(error);
        button.textContent = 'No se pudo copiar';

        setTimeout(() => {
          button.textContent = 'Copiar enlace';
        }, 2000);
      }
    });
  });
}
