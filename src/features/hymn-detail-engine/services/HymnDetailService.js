import { HymnRepository } from '../data/HymnRepository.js';

export class HymnDetailService {
  constructor(catalog = []) {
    this.repository = new HymnRepository(catalog);
  }

  getHymn(identifier) {
    return this.repository.find(identifier);
  }

  getNavigation(identifier) {
    return {
      previous: this.repository.getPrevious(identifier),
      next: this.repository.getNext(identifier)
    };
  }

  getHymnPage(identifier) {
    const hymn = this.getHymn(identifier);

    if (!hymn) {
      return null;
    }

    return {
      hymn,
      navigation: this.getNavigation(identifier)
    };
  }
}
