export function renderContactView() {
  return `
    <section class="cantico-section contact-page">

      <header class="contact-page__hero">
        <p class="contact-page__eyebrow">
          ESTAMOS PARA ESCUCHARTE
        </p>

        <h1 class="contact-page__title">
          Contacto
        </h1>

        <p class="contact-page__intro">
          Ponte en contacto con Cántico de Fe Music
          a través de nuestros canales oficiales.
        </p>
      </header>

      <section class="contact-page__section">

        <div class="contact-page__section-header">
          <div>
            <p class="contact-page__eyebrow">
              CÁNTICO DE FE MUSIC
            </p>

            <h2 class="contact-page__section-title">
              Conecta con nosotros
            </h2>
          </div>
        </div>

        <div class="contact-page__grid">

          <article class="contact-page__card">

            <div class="contact-page__icon" aria-hidden="true">
              ♪
            </div>

            <div class="contact-page__card-content">

              <span class="contact-page__badge">
                Canal oficial
              </span>

              <h3>
                Cántico de Fe Music
              </h3>

              <p>
                Himnos, alabanzas y música cristiana original
                creada para fortalecer la fe.
              </p>

              <div class="contact-page__card-actions">
                <a
                  class="contact-page__button"
                  href="#"
                  aria-label="Visitar canal oficial de Cántico de Fe Music"
                >
                  Visitar canal
                </a>
              </div>

            </div>

          </article>

          <article class="contact-page__card">

            <div class="contact-page__icon" aria-hidden="true">
              ✦
            </div>

            <div class="contact-page__card-content">

              <span class="contact-page__badge">
                Contacto
              </span>

              <h3>
                Mensajes y consultas
              </h3>

              <p>
                Para preguntas, comentarios o información,
                utiliza nuestros canales oficiales de contacto.
              </p>

            </div>

          </article>

        </div>

      </section>

    </section>
  `;
}
