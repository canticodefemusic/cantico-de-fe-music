export class HymnRepository {
  constructor(catalog = []) {
    this.catalog = catalog;
  }

  getAll() {
    return [...this.catalog];
  }

  getById(id) {
    return this.catalog.find(hymn => hymn.id === id) || null;
  }

  getBySlug(slug) {
    return this.catalog.find(hymn => hymn.slug === slug) || null;
  }

  find(identifier) {
    if (!identifier) return null;

    return (
      this.getById(identifier) ||
      this.getBySlug(identifier)
    );
  }

  getPrevious(identifier) {
    const index = this.catalog.findIndex(
      hymn => hymn.id === identifier || hymn.slug === identifier
    );

    if (index <= 0) return null;

    return this.catalog[index - 1];
  }

  getNext(identifier) {
    const index = this.catalog.findIndex(
      hymn => hymn.id === identifier || hymn.slug === identifier
    );

    if (index === -1 || index >= this.catalog.length - 1) return null;

    return this.catalog[index + 1];
  }
}
