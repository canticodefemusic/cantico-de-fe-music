/**
 * Cántico de Fe Music
 * V13.0.5 — Media Card Actions Menu
 */

function escapeHtml(value = '') {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getSafeMediaId(
  media = {}
) {
  return escapeHtml(
    media.id || ''
  );
}

export default function renderMediaCardMenu({
  media = null,
  selectable = true,
  allowMetadata = true,
  allowCopy = true,
  allowDownload = true
} = {}) {
  if (
    !media ||
    !media.id
  ) {
    return '';
  }

  const mediaId =
    getSafeMediaId(
      media
    );

  const mediaName =
    escapeHtml(
      media.name ||
      'archivo multimedia'
    );

  const mediaPath =
    escapeHtml(
      media.path ||
      ''
    );

  return `
    <div
      class="media-card-menu"
      data-media-card-menu
    >
      <button
        type="button"
        class="media-card-menu__trigger"
        aria-label="Abrir acciones de ${mediaName}"
        aria-haspopup="menu"
        aria-expanded="false"
        title="Más acciones"
        data-media-menu-toggle="${mediaId}"
      >
        <span
          aria-hidden="true"
        >
          ⋮
        </span>
      </button>

      <div
        class="media-card-menu__panel"
        role="menu"
        aria-label="Acciones de ${mediaName}"
        hidden
        data-media-menu-panel="${mediaId}"
      >
        ${
          allowMetadata
            ? `
              <button
                type="button"
                role="menuitem"
                data-media-metadata-edit="${mediaId}"
              >
                <span
                  aria-hidden="true"
                >
                  ✏️
                </span>

                <span>
                  Editar metadatos
                </span>
              </button>
            `
            : ''
        }

        <button
          type="button"
          role="menuitem"
          data-media-preview="${mediaId}"
        >
          <span
            aria-hidden="true"
          >
            👁️
          </span>

          <span>
            Vista previa
          </span>
        </button>

        ${
          selectable
            ? `
              <button
                type="button"
                role="menuitem"
                data-media-select="${mediaId}"
              >
                <span
                  aria-hidden="true"
                >
                  ✅
                </span>

                <span>
                  Seleccionar
                </span>
              </button>
            `
            : ''
        }

        ${
          allowCopy
            ? `
              <button
                type="button"
                role="menuitem"
                data-media-copy-path="${mediaPath}"
                ${
                  media.path
                    ? ''
                    : 'disabled'
                }
              >
                <span
                  aria-hidden="true"
                >
                  📋
                </span>

                <span>
                  Copiar ruta
                </span>
              </button>

              <button
                type="button"
                role="menuitem"
                data-media-copy-id="${mediaId}"
              >
                <span
                  aria-hidden="true"
                >
                  🆔
                </span>

                <span>
                  Copiar ID
                </span>
              </button>
            `
            : ''
        }

        ${
          allowDownload &&
          media.path
            ? `
              <a
                role="menuitem"
                href="${mediaPath}"
                download
                data-media-download="${mediaId}"
              >
                <span
                  aria-hidden="true"
                >
                  ⬇️
                </span>

                <span>
                  Descargar
                </span>
              </a>
            `
            : ''
        }
      </div>
    </div>
  `;
}

export {
  escapeHtml,
  getSafeMediaId
};
