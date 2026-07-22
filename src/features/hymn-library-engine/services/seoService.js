function setMeta(name, value, attribute = 'name') {
  if (!value) return;

  let tag = document.head.querySelector(`meta[${attribute}="${name}"]`);

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }

  tag.setAttribute('content', value);
}

function setCanonical(url) {
  let link = document.head.querySelector('link[rel="canonical"]');

  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }

  link.href = url;
}

export function updateSeo({
  title,
  description,
  url,
  image,
  siteName = 'Cántico de Fe Music'
}) {
  if (title) {
    document.title = `${title} | ${siteName}`;
  }

  setMeta('description', description);

  setMeta('og:title', title, 'property');
  setMeta('og:description', description, 'property');
  setMeta('og:type', 'website', 'property');
  setMeta('og:url', url, 'property');

  if (image) {
    setMeta('og:image', image, 'property');
  }

  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', title);
  setMeta('twitter:description', description);

  if (image) {
    setMeta('twitter:image', image);
  }

  if (url) {
    setCanonical(url);
  }
}
