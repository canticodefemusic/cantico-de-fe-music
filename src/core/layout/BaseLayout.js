export class BaseLayout {
  constructor(regions = {}) {
    this.regions = regions;
  }

  render() {
    return `
      <div class="layout">
        <header id="header"></header>
        <aside id="sidebar"></aside>
        <main id="content"></main>
        <footer id="footer"></footer>
      </div>
    `;
  }
}
