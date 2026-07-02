export class SEOManager {
  constructor(defaults = {}) {
    this.defaults = {
      siteName: 'Cántico de Fe Music',
      url: 'https://canticodefemusic.com',
      description: 'Himnos, alabanzas y música cristiana original.',
      ...defaults
    };
  }

  setMeta({ title, description, path = '/', image = '' } = {}) {
    const fullTitle = title
      ? `${title} | ${this.defaults.siteName}`
      : this.defaults.siteName;

    const metaDescription = description || this.defaults.description;
    const canonicalUrl = `${this.defaults.url}${path === '/' ? '' : path}`;

    document.title = fullTitle;
    this.upsert('description', metaDescription);
    this.upsertProperty('og:title', fullTitle);
    this.upsertProperty('og:description', metaDescription);
    this.upsertProperty('og:url', canonicalUrl);
    this.upsertProperty('og:type', 'website');
    this.upsertName('twitter:card', 'summary_large_image');
    this.upsertName('twitter:title', fullTitle);
    this.upsertName('twitter:description', metaDescription);

    if (image) {
      this.upsertProperty('og:image', image);
      this.upsertName('twitter:image', image);
    }

    this.setCanonical(canonicalUrl);
  }

  upsert(name, content) {
    this.upsertName(name, content);
  }

  upsertName(name, content) {
    let el = document.querySelector(`meta[name="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  upsertProperty(property, content) {
    let el = document.querySelector(`meta[property="${property}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('property', property);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  setCanonical(url) {
    let el = document.querySelector('link[rel="canonical"]');
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', 'canonical');
      document.head.appendChild(el);
    }
    el.setAttribute('href', url);
  }
}
