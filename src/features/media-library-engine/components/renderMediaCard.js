/**
 * Cántico de Fe Music
 * V12.8.2 — Media Card
 */

function renderType(type) {
  switch (type) {
    case 'image':
      return '🖼️';

    case 'audio':
      return '🎵';

    case 'video':
      return '🎥';

    case 'document':
      return '📄';

    default:
      return '📦';
  }
}

export default function renderMediaCard(
  media
) {
  return `
    <article
      class="media-card"
      data-media-id="${media.id}"
    >

      <header
        class="media-card__header"
      >
        <span
          class="media-card__type"
        >
          ${renderType(media.type)}
        </span>

        <strong>
          ${media.name}
        </strong>
      </header>

      <div
        class="media-card__body"
      >
        <p>
          ${media.description}
        </p>

        <dl>

          <dt>
            Tipo
          </dt>

          <dd>
            ${media.type}
          </dd>

          <dt>
            Categoría
          </dt>

          <dd>
            ${media.category}
          </dd>

          <dt>
            Formato
          </dt>

          <dd>
            ${media.extension}
          </dd>

        </dl>

      </div>

      <footer
        class="media-card__footer"
      >

        <button
          type="button"
          data-media-preview="${media.id}"
        >
          Vista previa
        </button>

        <button
          type="button"
          data-media-select="${media.id}"
        >
          Seleccionar
        </button>

      </footer>

    </article>
  `;
}
