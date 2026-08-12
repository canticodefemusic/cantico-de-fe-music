const contactChannels = [
  {
    id: 'youtube',
    label: 'YouTube',
    description:
      'Mira nuestros himnos y videos oficiales en el canal de Cántico de Fe Music.',
    href:
      'https://www.youtube.com/channel/UC8RSuzs2fSK8jrh-Zc9lNrg',
    icon: '▶',
    active: true
  },
  {
    id: 'email',
    label: 'Correo electrónico',
    description:
      'Canal de contacto para mensajes, preguntas y colaboraciones.',
    href: '',
    icon: '✉',
    active: false
  },
  {
    id: 'facebook',
    label: 'Facebook',
    description:
      'Próximamente podrás seguir Cántico de Fe Music en Facebook.',
    href: '',
    icon: 'f',
    active: false
  },
  {
    id: 'instagram',
    label: 'Instagram',
    description:
      'Próximamente podrás seguir Cántico de Fe Music en Instagram.',
    href: '',
    icon: '◎',
    active: false
  }
];

function renderContactChannel(channel) {
  const stateClass = channel.active
    ? 'is-active'
    : 'is-coming-soon';

  const action = channel.active
    ? `
      <a
        class="contact-channel__action"
        href="${channel.href}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir ${channel.label} de Cántico de Fe Music"
      >
        Abrir canal
      </a>
    `
    : `
      <span class="contact-channel__status">
        Próximamente
      </span>
    `;

  return `
    <article
      class="contact-channel ${stateClass}"
      data-contact-channel="${channel.id}"
    >
      <div
        class="contact-channel__icon"
        aria-hidden="true"
      >
        ${channel.icon}
      </div>

      <div class="contact-channel__content">
        <h3>
          ${channel.label}
        </h3>

        <p>
          ${channel.description}
        </p>

        ${action}
      </div>
    </article>
  `;
}

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
                  href="https://www.youtube.com/channel/UC8RSuzs2fSK8jrh-Zc9lNrg"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visitar canal oficial de Cántico de Fe Music en YouTube"
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

      <section class="contact-page__section contact-channels-section">

        <div class="contact-page__section-header">
          <div>
            <p class="contact-page__eyebrow">
              CANALES OFICIALES
            </p>

            <h2 class="contact-page__section-title">
              Encuéntranos también aquí
            </h2>
          </div>
        </div>

        <div class="contact-channels-grid">
          ${contactChannels
            .map(renderContactChannel)
            .join('')}
        </div>

      </section>

    </section>
  `;
}
