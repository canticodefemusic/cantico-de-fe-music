export class StartupManager {
  constructor(context) {
    this.context = context;
  }

  async start() {
    this.validateRoot();
    this.mountStatus();
    this.logStartup();
  }

  validateRoot() {
    const root = document.querySelector(this.context.rootSelector);

    if (!root) {
      throw new Error(`Root element not found: ${this.context.rootSelector}`);
    }

    this.context.root = root;
  }

  mountStatus() {
    if (!this.context.root) return;

    this.context.root.innerHTML = `
      <main class="cantico-build-ready">
        <section class="cantico-build-hero">
          <h1>Cántico de Fe Music</h1>
          <p>V8.0 Build Patch 01 activo</p>
          <p>Core registrado: ${this.context.services.size} motores</p>
          <p>Módulos registrados: ${this.context.modules.size} módulos</p>
        </section>

        <section class="cantico-build-grid">
          <article>
            <h2>Estado</h2>
            <p>Aplicación inicializada correctamente.</p>
          </article>

          <article>
            <h2>Próximo paso</h2>
            <p>Conectar páginas públicas, SEO y reproductor real.</p>
          </article>
        </section>
      </main>
    `;
  }

  logStartup() {
    console.info('[Cántico V8.0] Application started', {
      appName: this.context.appName,
      version: this.context.version,
      services: this.context.services.size,
      modules: this.context.modules.size
    });
  }
}
