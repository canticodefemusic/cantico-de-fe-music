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
  
  document.querySelectorAll('[data-share-whatsapp]').forEach(button => {
    button.addEventListener('click', () => {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent('Mira este himno de Cántico de Fe Music');

      window.open(
        `https://wa.me/?text=${text}%20${url}`,
        '_blank'
      );
    });
  });
  
  document.querySelectorAll('[data-share-facebook]').forEach(button => {
    button.addEventListener('click', () => {
      const url = encodeURIComponent(window.location.href);

      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        '_blank'
      );
    });
  });
}
