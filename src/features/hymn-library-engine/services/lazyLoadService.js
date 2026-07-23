const DEFAULT_SELECTOR = 'img[data-src]';

function loadImage(image) {
  const source = image.dataset.src;

  if (!source) {
    return;
  }

  image.src = source;
  image.removeAttribute('data-src');
  image.classList.add('is-loaded');
}

export function initLazyLoad({
  selector = DEFAULT_SELECTOR,
  rootMargin = '200px 0px',
  threshold = 0.01
} = {}) {
  const images = document.querySelectorAll(selector);

  if (!images.length) {
    return;
  }

  if (!('IntersectionObserver' in window)) {
    images.forEach(loadImage);
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          return;
        }

        loadImage(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin,
      threshold
    }
  );

  images.forEach(image => observer.observe(image));
}
