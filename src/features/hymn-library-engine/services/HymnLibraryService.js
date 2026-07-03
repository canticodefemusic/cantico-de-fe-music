import { hymnCatalog } from '../data/hymnCatalog.js';

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
    const value = String(query || '').trim().toLowerCase();
    if (!value) return this.list();

    return this.catalog.filter(hymn => {
      return [
        hymn.title,
        hymn.subtitle,
        hymn.scripture,
        hymn.category,
        hymn.description,
        ...(hymn.tags || [])
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(value);
    });
  }

  categories() {
    return [...new Set(this.catalog.map(hymn => hymn.category).filter(Boolean))];
  }
}
