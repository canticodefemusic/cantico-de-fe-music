function removeStructuredData() {
  document
    .querySelectorAll('script[data-structured-data]')
    .forEach(script => script.remove());
}

export function updateStructuredData({
  title = 'Cántico de Fe Music',
  description = 'Escucha himnos cristianos inspirados en la Palabra de Dios.',
  url = window.location.href,
  image = '/assets/img/covers/default-social-cover.png'
} = {}) {
  removeStructuredData();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MusicComposition',
    name: title,
    description,
    url,
    image,
    publisher: {
      '@type': 'Organization',
      name: 'Cántico de Fe Music'
    }
  };

  const script = document.createElement('script');

  script.type = 'application/ld+json';
  script.dataset.structuredData = 'true';
  script.textContent = JSON.stringify(schema);

  document.head.appendChild(script);
}
