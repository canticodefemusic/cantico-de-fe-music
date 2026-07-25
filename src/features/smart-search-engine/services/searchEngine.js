function normalize(text = '') {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ñ/g, 'n')
    .trim();
}

function scoreItem(item, term) {
  let score = 0;

  const title = normalize(item.title || '');
  const subtitle = normalize(item.subtitle || '');
  const artist = normalize(item.artist || '');
  const category = normalize(item.category || '');
  const theme = normalize(item.theme || '');
  const description = normalize(item.description || '');

  const scriptures = normalize(
    Array.isArray(item.scriptures)
      ? item.scriptures.join(' ')
      : item.scripture || ''
  );

  const tags = normalize(
    Array.isArray(item.tags)
      ? item.tags.join(' ')
      : ''
  );

  if (title.startsWith(term)) score += 100;
  if (title.includes(term)) score += 80;

  if (subtitle.includes(term)) score += 50;
  if (artist.includes(term)) score += 40;
  if (category.includes(term)) score += 35;
  if (theme.includes(term)) score += 30;
  if (scriptures.includes(term)) score += 25;
  if (tags.includes(term)) score += 20;
  if (description.includes(term)) score += 10;

  return score;
}

export function searchItems(items = [], query = '') {
  const term = normalize(query);

  if (!term) {
    return items;
  }

  return items
    .map(item => ({
      ...item,
      __score: scoreItem(item, term)
    }))
    .filter(item => item.__score > 0)
    .sort((a, b) => b.__score - a.__score)
    .map(({ __score, ...item }) => item);
}
