/**
 * Cántico de Fe Music
 * V13.0.4 — Admin Media Library View
 */

import {
  MediaLibraryState,
  renderMediaBrowser
} from '../../media-library-engine/index.js';

export function renderAdminMediaLibrary() {
  const state =
    MediaLibraryState.getState();

  return `
    <section
      class="admin-section admin-media-library"
      data-admin-current-section="media"
      data-admin-media-library
    >
      <div
        class="admin-media-library__browser"
        data-admin-media-library-browser
      >
        ${renderMediaBrowser({
          query:
            state.query,

          type:
            state.type,

          category:
            state.category,

          sort:
            state.sort,

          selectable:
            true,

          title:
            'Biblioteca multimedia',

          description:
            'Explora, selecciona y administra imágenes, audios, videos y otros recursos de Cántico de Fe Music.'
        })}
      </div>

      <div
        class="admin-media-library__metadata-host"
        data-media-metadata-host
        hidden
      ></div>
    </section>
  `;
}

export default
  renderAdminMediaLibrary;
