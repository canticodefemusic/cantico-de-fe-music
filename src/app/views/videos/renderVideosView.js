export function renderVideosView() {
  return `
    <section
      class="
        cantico-section
        videos-page
      "
    >
      <header
        class="videos-page__header"
      >
        <p
          class="videos-page__kicker"
        >
          Videos oficiales
        </p>

        <h1>
          Videos
        </h1>

        <p
          class="videos-page__description"
        >
          Aquí encontrarás los videos oficiales
          de Cántico de Fe Music.
        </p>
      </header>

      <section
        class="videos-featured"
      >
        <div
          class="videos-section__header"
        >
          <div>
            <p
              class="videos-section__kicker"
            >
              Próximamente
            </p>

            <h2>
              Videos destacados
            </h2>
          </div>
        </div>

        <div
          class="
            videos-empty
            cantico-empty
          "
        >
          <div
            class="videos-empty__icon"
            aria-hidden="true"
          >
            ▶
          </div>

          <div
            class="videos-empty__content"
          >
            <h3>
              Los videos oficiales
              estarán disponibles aquí
            </h3>

            <p>
              Próximamente podrás ver
              videoclips, presentaciones
              y contenido especial
              de Cántico de Fe Music.
            </p>

            <a
              class="
                cantico-button
                primary
              "
              href="/?page=himnos"
            >
              Explorar himnos
            </a>
          </div>
        </div>
      </section>
    </section>
  `;
}
