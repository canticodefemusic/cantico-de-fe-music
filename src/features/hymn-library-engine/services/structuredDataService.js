function removeStructuredData() {
  document
    .querySelectorAll('script[data-structured-data]')
    .forEach(script => script.remove());
}

export function updateStructuredData({
  title = 'Cántico de Fe Music',
  description = 'Escucha himnos cristianos inspirados en la Palabra de Dios.',
  url = window.location.href,
  image = '/assets/img/covers/default-social-cover.png',
  artist = 'Cántico de Fe Music',
  language = 'es',
  category = 'Himno cristiano',
  scripture = '',
  dateModified = new Date().toISOString()
} = {}) {
  removeStructuredData();

  const absoluteImageUrl = new URL(image, window.location.origin).href;
  const absolutePageUrl = new URL(url, window.location.origin).href;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MusicComposition',
    name: title,
    description,
    url: absolutePageUrl,
    image: absoluteImageUrl,
    inLanguage: language,
    genre: category,
    dateModified,
    composer: {
      '@type': 'Organization',
      name: artist
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cántico de Fe Music',
      url: window.location.origin
    }
  };

  if (scripture) {
    schema.about = {
      '@type': 'CreativeWork',
      name: scripture
    };
  }

  const script = document.createElement('script');

  script.type = 'application/ld+json';
  script.dataset.structuredData = 'true';
  script.textContent = JSON.stringify(schema);

  document.head.appendChild(script);
}
