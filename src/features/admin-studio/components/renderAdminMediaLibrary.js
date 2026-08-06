/**
 * Cántico de Fe Music
 * V12.9.2 — Admin Media Library View
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
          'Explora y selecciona imágenes, audios, videos y otros recursos de Cántico de Fe Music.'
      })}
    </section>
  `;
}

export default
  renderAdminMediaLibrary;
