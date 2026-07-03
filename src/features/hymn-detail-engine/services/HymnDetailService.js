export class HymnDetailService {
  constructor(catalog = []) {
    this.catalog = catalog;
  }

  findById(id) {
    return this.catalog.find(hymn => hymn.id === id) || null;
  }
}
