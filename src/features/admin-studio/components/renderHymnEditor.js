/**
 * Cántico de Fe Music
 * V12.2 — Professional Hymn Editor
 */

import AdminHymnService
  from '../services/AdminHymnService.js';

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function normalizeList(value) {
  if (!Array.isArray(value)) {
    return '';
  }

  return value
    .filter(Boolean)
    .join(', ');
}

function normalizeLyrics(value) {
  if (!Array.isArray(value)) {
    return '';
  }

  return value.join('\n');
}

function getStatusLabel(hymn = {}) {
  if (
    hymn.admin?.source ===
    'override'
  ) {
    return 'Modificado';
  }

  if (
    hymn.admin?.status ===
    'draft'
  ) {
    return 'Borrador';
  }

  return 'Publicado';
}

function renderNotFound() {
  return `
    <section
      class="admin-hymn-editor"
      data-admin-hymn-editor
    >
      <div
        class="admin-section__empty"
      >
        <div
          class="admin-section__empty-icon"
          aria-hidden="true"
        >
          🎵
        </div>

        <h2>
          Himno no encontrado
        </h2>

        <p>
          El himno solicitado no existe
          o ya fue eliminado.
        </p>

        <button
          type="button"
          class="admin-section__primary-action"
          data-admin-hymn-editor-back
        >
          Volver a himnos
        </button>
      </div>
    </section>
  `;
}

export function renderHymnEditor(
  hymnId
) {
  const hymn =
    AdminHymnService.findById(
      hymnId
    );

  if (!hymn) {
    return renderNotFound();
  }

  const statusLabel =
    getStatusLabel(hymn);

  const isDraft =
    hymn.admin?.source === 'draft';

  const isOverride =
    hymn.admin?.source === 'override';

  const hasStoredDraft =
    isDraft || isOverride;

  return `
    <section
      class="admin-hymn-editor"
      data-admin-hymn-editor
      data-admin-hymn-editor-id="${escapeHtml(
        hymn.id
      )}"
    >
      <header
        class="admin-hymn-editor__header"
      >
        <div
          class="admin-hymn-editor__heading"
        >
          <button
            type="button"
            class="admin-hymn-editor__back"
            data-admin-hymn-editor-back
          >
            <span
              aria-hidden="true"
            >
              ←
            </span>

            <span>
              Administrador de himnos
            </span>
          </button>

          <p
            class="admin-section__eyebrow"
          >
            EDITOR DE HIMNOS
          </p>

          <h1>
            ${escapeHtml(
              hymn.title ||
              'Himno sin título'
            )}
          </h1>

          <div
            class="admin-hymn-editor__status"
          >
            <span>
              ${escapeHtml(
                statusLabel
              )}
            </span>

            <span>
              ID:
              ${escapeHtml(
                hymn.id
              )}
            </span>
          </div>
        </div>

        <div
          class="admin-hymn-editor__header-actions"
        >
          <button
            type="button"
            data-admin-hymn-editor-preview
          >
            Vista previa
          </button>

          <button
            type="submit"
            form="adminHymnEditorForm"
            class="admin-hymn-editor__save"
          >
            Guardar borrador
          </button>
        </div>
      </header>

      <form
        id="adminHymnEditorForm"
        class="admin-hymn-editor__form"
        data-admin-hymn-editor-form
        novalidate
      >
        <input
          type="hidden"
          name="id"
          value="${escapeHtml(
            hymn.id
          )}"
        >

        <section
          class="admin-hymn-editor__panel"
        >
          <header
            class="admin-hymn-editor__panel-header"
          >
            <h2>
              Información principal
            </h2>

            <p>
              Datos básicos que identifican
              el himno dentro del sitio.
            </p>
          </header>

          <div
            class="admin-hymn-editor__fields"
          >
            <label
              class="admin-hymn-editor__field
              admin-hymn-editor__field--wide"
            >
              <span>
                Título
              </span>

              <input
                type="text"
                name="title"
                maxlength="120"
                required
                value="${escapeHtml(
                  hymn.title
                )}"
                placeholder="Título del himno"
              >
            </label>

            <label
              class="admin-hymn-editor__field
              admin-hymn-editor__field--wide"
            >
              <span>
                Subtítulo
              </span>

              <input
                type="text"
                name="subtitle"
                maxlength="180"
                value="${escapeHtml(
                  hymn.subtitle
                )}"
                placeholder="Descripción corta del himno"
              >
            </label>

            <label
              class="admin-hymn-editor__field"
            >
              <span>
                Categoría
              </span>

              <input
                type="text"
                name="category"
                maxlength="80"
                value="${escapeHtml(
                  hymn.category
                )}"
                placeholder="Ejemplo: Fe"
              >
            </label>

            <label
              class="admin-hymn-editor__field"
            >
              <span>
                Tema
              </span>

              <input
                type="text"
                name="theme"
                maxlength="120"
                value="${escapeHtml(
                  hymn.theme
                )}"
                placeholder="Ejemplo: Confianza en Dios"
              >
            </label>

            <label
              class="admin-hymn-editor__field
              admin-hymn-editor__field--wide"
            >
              <span>
                Artista
              </span>

              <input
                type="text"
                name="artist"
                maxlength="120"
                value="${escapeHtml(
                  hymn.artist
                )}"
                placeholder="Cántico de Fe Music"
              >
            </label>
          </div>
        </section>

        <section
          class="admin-hymn-editor__panel"
        >
          <header
            class="admin-hymn-editor__panel-header"
          >
            <h2>
              Contenido y referencias
            </h2>

            <p>
              Descripción, referencias bíblicas,
              etiquetas y letra completa.
            </p>
          </header>

          <div
            class="admin-hymn-editor__fields"
          >
            <label
              class="admin-hymn-editor__field
              admin-hymn-editor__field--wide"
            >
              <span>
                Referencias bíblicas
              </span>

              <input
                type="text"
                name="scriptures"
                value="${escapeHtml(
                  normalizeList(
                    hymn.scriptures
                  )
                )}"
                placeholder="Mateo 17:20, Hebreos 11:1"
              >

              <small>
                Separa cada referencia con una coma.
              </small>
            </label>

            <label
              class="admin-hymn-editor__field
              admin-hymn-editor__field--wide"
            >
              <span>
                Descripción
              </span>

              <textarea
                name="description"
                rows="5"
                maxlength="600"
                placeholder="Descripción del himno"
              >${escapeHtml(
                hymn.description
              )}</textarea>
            </label>

            <label
              class="admin-hymn-editor__field
              admin-hymn-editor__field--wide"
            >
              <span>
                Letra del himno
              </span>

              <textarea
                name="lyrics"
                rows="18"
                spellcheck="true"
                placeholder="Escribe aquí la letra completa del himno..."
              >${escapeHtml(
                normalizeLyrics(
                  hymn.lyrics
                )
              )}</textarea>

              <small>
                Conserva las líneas en blanco
                para separar versos y coros.
              </small>
            </label>

            <label
              class="admin-hymn-editor__field
              admin-hymn-editor__field--wide"
            >
              <span>
                Etiquetas
              </span>

              <input
                type="text"
                name="tags"
                value="${escapeHtml(
                  normalizeList(
                    hymn.tags
                  )
                )}"
                placeholder="fe, oración, confianza, adoración"
              >

              <small>
                Separa cada etiqueta con una coma.
              </small>
            </label>
          </div>
        </section>

        <section
          class="admin-hymn-editor__panel"
        >
          <header
            class="admin-hymn-editor__panel-header"
          >
            <h2>
              Audio e imagen
            </h2>

            <p>
              Rutas actuales de los recursos
              usados por el reproductor y la portada.
            </p>
          </header>

          <div
            class="admin-hymn-editor__fields"
          >
            <label
              class="admin-hymn-editor__field
              admin-hymn-editor__field--wide"
            >
              <span>
                Archivo de audio
              </span>

              <input
                type="text"
                name="audio"
                value="${escapeHtml(
                  hymn.audio ||
                  hymn.src
                )}"
                placeholder="/assets/audio/himnos/archivo.mp3"
              >
            </label>

            <label
              class="admin-hymn-editor__field
              admin-hymn-editor__field--wide"
            >
              <span>
                Portada
              </span>

              <input
                type="text"
                name="cover"
                value="${escapeHtml(
                  hymn.cover
                )}"
                placeholder="/assets/images/portadas/portada.jpg"
              >
            </label>

            <label
              class="admin-hymn-editor__field"
            >
              <span>
                Duración
              </span>

              <input
                type="text"
                name="duration"
                maxlength="20"
                value="${escapeHtml(
                  hymn.duration
                )}"
                placeholder="4:30"
              >
            </label>
          </div>
        </section>

        <section
          class="admin-hymn-editor__panel"
        >
          <header
            class="admin-hymn-editor__panel-header"
          >
            <h2>
              Derechos y publicación
            </h2>

            <p>
              Información de autoría y estado
              administrativo del himno.
            </p>
          </header>

          <div
            class="admin-hymn-editor__fields"
          >
            <label
              class="admin-hymn-editor__field"
            >
              <span>
                Titular de los derechos
              </span>

              <input
                type="text"
                name="copyrightHolder"
                maxlength="120"
                value="${escapeHtml(
                  hymn.copyright?.holder
                )}"
                placeholder="Cántico de Fe Music"
              >
            </label>

            <label
              class="admin-hymn-editor__field"
            >
              <span>
                Licencia
              </span>

              <input
                type="text"
                name="copyrightLicense"
                maxlength="160"
                value="${escapeHtml(
                  hymn.copyright?.license
                )}"
                placeholder="Todos los derechos reservados"
              >
            </label>
          </div>
        </section>

        <footer
          class="admin-hymn-editor__footer"
        >
          <div
            class="admin-hymn-editor__footer-left"
          >
            ${
              hasStoredDraft
                ? `
                  <button
                    type="button"
                    class="admin-hymn-editor__danger"
                    data-admin-hymn-editor-remove-draft
                    data-admin-hymn-editor-restore="${String(
                      isOverride
                    )}"
                  >
                    ${
                      isOverride
                        ? 'Descartar cambios'
                        : 'Eliminar borrador'
                    }
                  </button>
                `
                : ''
            }
          </div>

          <div
            class="admin-hymn-editor__footer-right"
          >
            <button
              type="button"
              data-admin-hymn-editor-duplicate
            >
              Duplicar
            </button>

            <button
              type="button"
              data-admin-hymn-editor-back
            >
              Cancelar
            </button>

            <button
              type="submit"
              class="admin-hymn-editor__save"
            >
              Guardar borrador
            </button>
          </div>
        </footer>
      </form>
    </section>
  `;
}

export default renderHymnEditor;
