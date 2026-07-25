/**
 * V9.0.4 Collections Engine
 * CollectionTemplates
 *
 * Contiene únicamente las plantillas HTML de las colecciones.
 */

const DEFAULT_COVER = '/assets/images/default-social-cover.png';

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getCollectionCover(collection = {}) {
  return collection.cover || DEFAULT_COVER;
}

function getCollectionTitle(collection = {}) {
  return collection.title || 'Colección sin título';
}

function getCollectionCountText(count = 0) {
  const total = Number(count) || 0;

  return total === 1
    ? '1 himno'
    : `${total} himnos`;
}

function getCollectionTypeLabel(type = '') {
  const labels = {
    album: 'Álbum',
    author: 'Autor',
    category: 'Categoría',
    theme: 'Tema',
    year: 'Año',
    series: 'Serie',
    book: 'Libro bíblico',
    recent: 'Recientes',
    popular: 'Popular',
    favorites: 'Favoritos',
    history: 'Historial',
    recommendation: 'Recomendación',
    custom: 'Colección'
  };

  return labels[type] || 'Colección';
}

function collectionCardTemplate(collection = {}) {
  const id = escapeHtml(collection.id || '');
  const title = escapeHtml(getCollectionTitle(collection));
  const cover = escapeHtml(getCollectionCover(collection));
  const type = escapeHtml(collection.type || 'custom');
  const typeLabel = escapeHtml(
    getCollectionTypeLabel(collection.type)
  );
  const countText = escapeHtml(
    getCollectionCountText(collection.count)
  );

  return `
    <article
      class="hymn-collection-card"
      data-collection-id="${id}"
      data-collection-type="${type}"
    >
      <button
        class="hymn-collection-card__button"
        type="button"
        data-collection-open="${id}"
        aria-label="Abrir la colección ${title}"
      >
        <div class="hymn-collection-card__cover-wrapper">
          <img
            class="hymn-collection-card__cover"
            src="${cover}"
            alt="Portada de ${title}"
            loading="lazy"
            decoding="async"
          >

          <span class="hymn-collection-card__badge">
            ${typeLabel}
          </span>
        </div>

        <div class="hymn-collection-card__content">
          <h3 class="hymn-collection-card__title">
            ${title}
          </h3>

          <p class="hymn-collection-card__count">
            ${countText}
          </p>
        </div>
      </button>
    </article>
  `;
}

function collectionListItemTemplate(collection = {}) {
  const id = escapeHtml(collection.id || '');
  const title = escapeHtml(getCollectionTitle(collection));
  const cover = escapeHtml(getCollectionCover(collection));
  const typeLabel = escapeHtml(
    getCollectionTypeLabel(collection.type)
  );
  const countText = escapeHtml(
    getCollectionCountText(collection.count)
  );

  return `
    <article
      class="hymn-collection-list-item"
      data-collection-id="${id}"
    >
      <button
        class="hymn-collection-list-item__button"
        type="button"
        data-collection-open="${id}"
        aria-label="Abrir la colección ${title}"
      >
        <img
          class="hymn-collection-list-item__cover"
          src="${cover}"
          alt=""
          loading="lazy"
          decoding="async"
        >

        <div class="hymn-collection-list-item__content">
          <span class="hymn-collection-list-item__type">
            ${typeLabel}
          </span>

          <h3 class="hymn-collection-list-item__title">
            ${title}
          </h3>

          <span class="hymn-collection-list-item__count">
            ${countText}
          </span>
        </div>

        <span
          class="hymn-collection-list-item__arrow"
          aria-hidden="true"
        >
          ›
        </span>
      </button>
    </article>
  `;
}

function emptyCollectionsTemplate({
  title = 'No se encontraron colecciones',
  message = 'Todavía no hay colecciones disponibles.'
} = {}) {
  return `
    <div class="hymn-collections-empty" role="status">
      <div
        class="hymn-collections-empty__icon"
        aria-hidden="true"
      >
        ♫
      </div>

      <h3 class="hymn-collections-empty__title">
        ${escapeHtml(title)}
      </h3>

      <p class="hymn-collections-empty__message">
        ${escapeHtml(message)}
      </p>
    </div>
  `;
}

function collectionsLoadingTemplate() {
  return `
    <div
      class="hymn-collections-loading"
      role="status"
      aria-live="polite"
    >
      <span
        class="hymn-collections-loading__spinner"
        aria-hidden="true"
      ></span>

      <span class="hymn-collections-loading__text">
        Cargando colecciones…
      </span>
    </div>
  `;
}

function collectionsGridTemplate(collections = []) {
  if (!Array.isArray(collections) || !collections.length) {
    return emptyCollectionsTemplate();
  }

  return `
    <div class="hymn-collections-grid">
      ${collections
        .map(collectionCardTemplate)
        .join('')}
    </div>
  `;
}

function collectionsListTemplate(collections = []) {
  if (!Array.isArray(collections) || !collections.length) {
    return emptyCollectionsTemplate();
  }

  return `
    <div class="hymn-collections-list">
      ${collections
        .map(collectionListItemTemplate)
        .join('')}
    </div>
  `;
}

function collectionsSectionTemplate({
  id = '',
  title = 'Colecciones',
  description = '',
  collections = [],
  view = 'grid'
} = {}) {
  const safeId = escapeHtml(id);
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);

  const content =
    view === 'list'
      ? collectionsListTemplate(collections)
      : collectionsGridTemplate(collections);

  return `
    <section
      class="hymn-collections-section"
      ${safeId ? `id="${safeId}"` : ''}
    >
      <header class="hymn-collections-section__header">
        <div>
          <h2 class="hymn-collections-section__title">
            ${safeTitle}
          </h2>

          ${
            safeDescription
              ? `
                <p class="hymn-collections-section__description">
                  ${safeDescription}
                </p>
              `
              : ''
          }
        </div>

        <div
          class="hymn-collections-section__view-controls"
          aria-label="Cambiar vista de las colecciones"
        >
          <button
            type="button"
            data-collections-view="grid"
            aria-label="Vista de cuadrícula"
            aria-pressed="${view === 'grid'}"
          >
            Cuadrícula
          </button>

          <button
            type="button"
            data-collections-view="list"
            aria-label="Vista de lista"
            aria-pressed="${view === 'list'}"
          >
            Lista
          </button>
        </div>
      </header>

      <div
        class="hymn-collections-section__content"
        data-collections-content
      >
        ${content}
      </div>
    </section>
  `;
}

export const CollectionTemplates = {
  card: collectionCardTemplate,
  listItem: collectionListItemTemplate,
  grid: collectionsGridTemplate,
  list: collectionsListTemplate,
  section: collectionsSectionTemplate,
  empty: emptyCollectionsTemplate,
  loading: collectionsLoadingTemplate
};

export default CollectionTemplates;
