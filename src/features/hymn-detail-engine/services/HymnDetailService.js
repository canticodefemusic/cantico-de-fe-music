export class HymnDetailService {
  constructor(catalog = []) {
    this.catalog = catalog;
  }

  findById(id) {
    return this.catalog.find(hymn => hymn.id === id) || null;
  }

  findBySlug(slug) {
    return this.catalog.find(hymn => hymn.slug === slug) || null;
  }

  find(identifier) {
    return (
      this.findById(identifier) ||
      this.findBySlug(identifier)
    );
  }
}
