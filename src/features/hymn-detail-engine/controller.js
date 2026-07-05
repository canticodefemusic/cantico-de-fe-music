import { HymnDetailService } from './services/HymnDetailService.js';

export class HymnDetailController {
  constructor(catalog = []) {
    this.service = new HymnDetailService(catalog);
  }

  render(identifier) {
    const page = this.service.getHymnPage(identifier);

    if (!page) {
      return `
        <section class="hymn-not-found">
          <h2>Himno no encontrado</h2>
          <p>El himno solicitado no existe.</p>
        </section>
      `;
    }

    return page;
  }
}
