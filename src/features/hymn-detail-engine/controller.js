import { HymnDetailService } from './services/HymnDetailService.js';
import { renderHymnDetailView } from './components/HymnDetailView.js';

export class HymnDetailController {
  constructor(catalog = []) {
    this.service = new HymnDetailService(catalog);
  }

  render(identifier) {
    const hymn = this.service.find(identifier);
    return renderHymnDetailView(hymn);
  }
}
