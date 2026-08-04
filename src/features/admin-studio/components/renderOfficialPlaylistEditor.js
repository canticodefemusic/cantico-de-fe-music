/**
 * Cántico de Fe Music
 * V12.6.6 — Official Playlist Editor
 */

import renderAdminContentEditor
  from '../core/renderAdminContentEditor.js';

export function renderOfficialPlaylistEditor() {

  return renderAdminContentEditor({

    editorId:
      'official-playlist',

    eyebrow:
      'PLAYLIST OFICIAL',

    title:
      'Nueva playlist',

    panels: [

      {
        id: 'general',

        title:
          'Información principal',

        description:
          'Información básica de la playlist.',

        content: () => `
          <p>
            Aquí irán
            título,
            descripción,
            slug
            y portada.
          </p>
        `
      },

      {
        id: 'hymns',

        title:
          'Himnos',

        description:
          'Selecciona los himnos que formarán parte de esta playlist.',

        content: () => `
          <p>
            Aquí aparecerá el selector profesional de himnos.
          </p>
        `
      },

      {
        id: 'appearance',

        title:
          'Presentación',

        description:
          'Personaliza la apariencia pública.',

        content: () => `
          <p>
            Portada,
            color,
            icono
            y orden.
          </p>
        `
      },

      {
        id: 'publish',

        title:
          'Publicación',

        description:
          'Controla la visibilidad de la playlist.',

        content: () => `
          <p>
            Visible,
            destacada,
            fecha
            y publicación.
          </p>
        `
      }

    ],

    footerLeftActions: [

      {
        label:
          'Cancelar',

        attributes: {
          'data-admin-editor-back': true
        }
      }

    ],

    footerRightActions: [

      {
        label:
          'Guardar borrador',

        primary: true,

        type:
          'submit'
      }

    ]

  });

}

export default
  renderOfficialPlaylistEditor;
