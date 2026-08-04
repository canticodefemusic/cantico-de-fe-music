/**
 * Cántico de Fe Music
 * V12.6.9 — Official Playlist Editor
 */

import renderAdminContentEditor
  from '../core/renderAdminContentEditor.js';

import AdminState
  from '../services/AdminState.js';

import AdminOfficialPlaylistService
  from '../services/AdminOfficialPlaylistService.js';

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function createEmptyPlaylist() {
  return {
    id: '',
    title: '',
    description: '',
    cover:
      '/assets/images/default-social-cover.png',
    hymnIds: [],
    featured: false,
    order: 0,
    admin: {
      source: 'draft',
      status: 'draft',
      published: false
    }
  };
}

function getSelectedPlaylist() {
  const state =
    AdminState.getState();

  const selectedId =
    state.selectedItem;

  if (
    !selectedId ||
    selectedId === '__new__'
  ) {
    return {
      playlist:
        createEmptyPlaylist(),

      isNew: true
    };
  }

  const playlist =
    AdminOfficialPlaylistService
      .findById(selectedId);

  return {
    playlist,
    isNew: false
  };
}

function getStatusLabel(
  playlist = {},
  isNew = false
) {
  if (isNew) {
    return 'Nueva';
  }

  if (
    playlist.admin?.source ===
    'override'
  ) {
    return 'Modificada';
  }

  if (
    playlist.admin?.status ===
    'published'
  ) {
    return 'Publicada';
  }

  return 'Borrador';
}

function renderGeneralPanel(
  playlist = {}
) {
  return `
    <div
      class="admin-content-editor__fields"
    >
      <label
        class="admin-content-editor__field"
        for="officialPlaylistTitle"
      >
        <span>
          Título
        </span>

        <input
          id="officialPlaylistTitle"
          type="text"
          name="title"
          maxlength="120"
          autocomplete="off"
          required
          placeholder="Ejemplo: Himnos de fe"
          value="${escapeHtml(
            playlist.title
          )}"
          data-admin-official-playlist-title
        >

        <small>
          Nombre que verán los visitantes.
        </small>
      </label>

      <label
        class="admin-content-editor__field"
        for="officialPlaylistId"
      >
        <span>
          ID o slug
        </span>

        <input
          id="officialPlaylistId"
          type="text"
          name="id"
          maxlength="120"
          autocomplete="off"
          spellcheck="false"
          placeholder="himnos-de-fe"
          value="${escapeHtml(
            playlist.id
          )}"
          data-admin-official-playlist-id
        >

        <small>
          Usa letras minúsculas, números y
          guiones. Si lo dejas vacío, se
          generará a partir del título.
        </small>
      </label>

      <label
        class="
          admin-content-editor__field
          admin-content-editor__field--full
        "
        for="officialPlaylistDescription"
      >
        <span>
          Descripción
        </span>

        <textarea
          id="officialPlaylistDescription"
          name="description"
          rows="5"
          maxlength="500"
          placeholder="Describe el propósito de esta playlist..."
          data-admin-official-playlist-description
        >${escapeHtml(
          playlist.description
        )}</textarea>

        <small>
          Explica qué tipo de himnos contiene
          esta selección.
        </small>
      </label>
    </div>
  `;
}

function renderHymnsPanel(
  playlist = {}
) {
  const hymnCount =
    Array.isArray(
      playlist.hymnIds
    )
      ? playlist.hymnIds.length
      : 0;

  return `
    <div
      class="admin-official-playlist-editor__hymns"
    >
      <p>
        Himnos seleccionados:
        <strong>
          ${hymnCount}
        </strong>
      </p>

      <p>
        En la siguiente etapa agregaremos
        el buscador, la selección y el
        ordenamiento de himnos.
      </p>
    </div>
  `;
}

function renderAppearancePanel(
  playlist = {}
) {
  return `
    <div
      class="admin-content-editor__fields"
    >
      <label
        class="
          admin-content-editor__field
          admin-content-editor__field--full
        "
        for="officialPlaylistCover"
      >
        <span>
          Ruta de la portada
        </span>

        <input
          id="officialPlaylistCover"
          type="text"
          name="cover"
          autocomplete="off"
          placeholder="/assets/images/default-social-cover.png"
          value="${escapeHtml(
            playlist.cover ||
            '/assets/images/default-social-cover.png'
          )}"
          data-admin-official-playlist-cover
        >

        <small>
          Más adelante podrás seleccionar o
          subir una imagen desde la Biblioteca
          Multimedia.
        </small>
      </label>

      <label
        class="admin-content-editor__field"
        for="officialPlaylistOrder"
      >
        <span>
          Orden
        </span>

        <input
          id="officialPlaylistOrder"
          type="number"
          name="order"
          min="0"
          step="1"
          value="${Number(
            playlist.order || 0
          )}"
          data-admin-official-playlist-order
        >

        <small>
          Los números menores aparecen primero.
        </small>
      </label>
    </div>
  `;
}

function renderPublishPanel(
  playlist = {}
) {
  return `
    <div
      class="admin-content-editor__options"
    >
      <label
        class="admin-content-editor__checkbox"
      >
        <input
          type="checkbox"
          name="featured"
          value="true"
          ${
            playlist.featured
              ? 'checked'
              : ''
          }
          data-admin-official-playlist-featured
        >

        <span>
          <strong>
            Playlist destacada
          </strong>

          Mostrar esta playlist en lugares
          destacados del sitio.
        </span>
      </label>
    </div>
  `;
}

export function renderOfficialPlaylistEditor() {
  const {
    playlist,
    isNew
  } = getSelectedPlaylist();

  if (!playlist) {
    return renderAdminContentEditor({
      notFound: true,

      backLabel:
        'Regresar a playlists',

      backAttribute:
        'data-admin-official-playlist-editor-back',

      notFoundOptions: {
        title:
          'Playlist no encontrada',

        description:
          'La playlist solicitada no existe o fue eliminada.'
      }
    });
  }

  return renderAdminContentEditor({
    editorId:
      playlist.id ||
      '__new__',

    formId:
      'adminOfficialPlaylistEditorForm',

    eyebrow:
      'PLAYLIST OFICIAL',

    title:
      isNew
        ? 'Nueva playlist'
        : (
            playlist.title ||
            'Playlist sin título'
          ),

    backLabel:
      'Regresar',

    backAttribute:
      'data-admin-official-playlist-editor-back',

    statusItems: [
      {
        label:
          'Estado',

        value:
          getStatusLabel(
            playlist,
            isNew
          )
      },

      {
        label:
          'Himnos',

        value:
          String(
            playlist.hymnIds?.length ||
            0
          )
      }
    ],

    panels: [
      {
        id:
          'general',

        title:
          'Información principal',

        description:
          'Define el título, identificador y descripción de la playlist.',

        content: () =>
          renderGeneralPanel(
            playlist
          )
      },

      {
        id:
          'hymns',

        title:
          'Himnos',

        description:
          'Selecciona los himnos que formarán parte de esta playlist.',

        content: () =>
          renderHymnsPanel(
            playlist
          )
      },

      {
        id:
          'appearance',

        title:
          'Presentación',

        description:
          'Personaliza la portada y el orden de aparición.',

        content: () =>
          renderAppearancePanel(
            playlist
          )
      },

      {
        id:
          'publish',

        title:
          'Publicación',

        description:
          'Controla cómo se mostrará la playlist en el sitio.',

        content: () =>
          renderPublishPanel(
            playlist
          )
      }
    ],

    hiddenFields: [
      {
        name:
          'originalId',

        value:
          playlist.id || ''
      }
    ],

    formAttributes: {
      'data-admin-official-playlist-editor-form':
        true
    },

    footerLeftActions: [
      {
        label:
          'Cancelar',

        attributes: {
          'data-admin-official-playlist-editor-back':
            true
        }
      }
    ],

    footerRightActions: [
      {
        label:
          'Guardar borrador',

        primary: true,

        type:
          'submit',

        form:
          'adminOfficialPlaylistEditorForm'
      }
    ]
  });
}

export default
  renderOfficialPlaylistEditor;
