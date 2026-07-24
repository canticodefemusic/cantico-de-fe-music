import { hymnCatalog } from '../data/hymnCatalog.js';
import { searchItems } from '../../smart-search-engine/services/searchEngine.js';

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
  return searchItems(this.catalog, query);
}

  categories() {
    return [...new Set(this.catalog.map(hymn => hymn.category).filter(Boolean))];
  }
}
