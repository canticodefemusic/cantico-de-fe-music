import { hymnCatalog } from '../data/hymnCatalog.js';

function normalizeText(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ñ/g, 'n');
}

export class HymnLibraryService {
  constructor(catalog = hymnCatalog) {
    this.catalog = catalog;
  }

  list() {
    return [...this.catalog];
  }

  findById(id) {
    return this.catalog.find(hymn => hymn.id === id) || null;
  }

  search(query) {
    const value = normalizeText(String(query || '').trim());
    if (!value) return this.list();

    const searchText = [
  hymn.title,
  hymn.subtitle,
  hymn.scripture,
  hymn.category,
  hymn.description,
  ...(hymn.tags || [])
]
  .filter(Boolean)
  .join(' ');

return normalizeText(searchText).includes(value);
    });
  }

  categories() {
    return [...new Set(this.catalog.map(hymn => hymn.category).filter(Boolean))];
  }
}
