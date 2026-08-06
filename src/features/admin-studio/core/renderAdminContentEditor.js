/**
 * Cántico de Fe Music
 * V12.6.5 — Admin Content Editor Core
 */

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function normalizeActions(
  actions = []
) {
  if (!Array.isArray(actions)) {
    return [];
  }

  return actions.filter(
    action =>
      action &&
      typeof action === 'object' &&
      action.label
  );
}

function renderActionButton(
  action = {}
) {
  const attributes =
    action.attributes &&
    typeof action.attributes === 'object'
      ? Object.entries(
          action.attributes
        )
          .map(
            ([name, value]) => {
              if (
                value === false ||
                value === null ||
                value === undefined
              ) {
                return '';
              }

              if (value === true) {
                return escapeHtml(
                  name
                );
              }

              return `${escapeHtml(
                name
              )}="${escapeHtml(
                value
              )}"`;
            }
          )
          .filter(Boolean)
          .join(' ')
      : '';

  const buttonType =
    action.type === 'submit'
      ? 'submit'
      : 'button';

  const className = [
    'admin-content-editor__action',
    action.primary
      ? 'admin-content-editor__action--primary'
      : '',
    action.danger
      ? 'admin-content-editor__action--danger'
      : ''
  ]
    .filter(Boolean)
    .join(' ');

  return `
    <button
      type="${buttonType}"
      class="${escapeHtml(
        className
      )}"
      ${
        action.form
          ? `form="${escapeHtml(
              action.form
            )}"`
          : ''
      }
      ${attributes}
    >
      ${
        action.icon
          ? `
            <span
              aria-hidden="true"
            >
              ${escapeHtml(
                action.icon
              )}
            </span>
          `
          : ''
      }

      <span>
        ${escapeHtml(
          action.label
        )}
      </span>
    </button>
  `;
}

function renderActions(
  actions = []
) {
  return normalizeActions(
    actions
  )
    .map(
      renderActionButton
    )
    .join('');
}

function renderStatusItems(
  items = []
) {
  if (!Array.isArray(items)) {
    return '';
  }

  return items
    .filter(
      item =>
        item &&
        (
          item.label ||
          item.value
        )
    )
    .map(item => `
      <span
        class="admin-content-editor__status-item"
      >
        ${
          item.label
            ? `
              <strong>
                ${escapeHtml(
                  item.label
                )}:
              </strong>
            `
            : ''
        }

        ${escapeHtml(
          item.value
        )}
      </span>
    `)
    .join('');
}

function renderPanel(
  panel = {},
  index = 0
) {
  const content =
    typeof panel.content ===
      'function'
      ? panel.content()
      : panel.content || '';

  return `
    <section
      class="admin-content-editor__panel"
      data-admin-editor-panel="${escapeHtml(
        panel.id ||
        `panel-${index + 1}`
      )}"
    >
      ${
        panel.title ||
        panel.description
          ? `
            <header
              class="admin-content-editor__panel-header"
            >
              ${
                panel.title
                  ? `
                    <h2>
                      ${escapeHtml(
                        panel.title
                      )}
                    </h2>
                  `
                  : ''
              }

              ${
                panel.description
                  ? `
                    <p>
                      ${escapeHtml(
                        panel.description
                      )}
                    </p>
                  `
                  : ''
              }
            </header>
          `
          : ''
      }

      <div
        class="admin-content-editor__panel-content"
      >
        ${content}
      </div>
    </section>
  `;
}

function renderPanels(
  panels = []
) {
  if (!Array.isArray(panels)) {
    return '';
  }

  return panels
    .map(
      renderPanel
    )
    .join('');
}

function renderNotFound({
  title =
    'Contenido no encontrado',

  description =
    'El contenido solicitado no existe o ya fue eliminado.',

  backLabel =
    'Regresar',

  backAttribute =
    'data-admin-editor-back'
} = {}) {
  return `
    <section
      class="admin-content-editor"
      data-admin-content-editor
    >
      <div
        class="admin-section__empty"
      >
        <div
          class="admin-section__empty-icon"
          aria-hidden="true"
        >
          ⚠️
        </div>

        <h2>
          ${escapeHtml(
            title
          )}
        </h2>

        <p>
          ${escapeHtml(
            description
          )}
        </p>

        <button
          type="button"
          class="admin-section__primary-action"
          ${backAttribute}
        >
          ${escapeHtml(
            backLabel
          )}
        </button>
      </div>
    </section>
  `;
}

export function renderAdminContentEditor({
  editorId = '',
  formId =
    'adminContentEditorForm',

  eyebrow =
    'EDITOR DE CONTENIDO',

  title =
    'Contenido sin título',

  backLabel =
    'Regresar',

  backAttribute =
    'data-admin-editor-back',

  statusItems = [],

  headerActions = [],

  panels = [],

  footerLeftActions = [],

  footerRightActions = [],

  hiddenFields = [],

  formAttributes = {},

  notFound = false,

  notFoundOptions = {}
} = {}) {
  if (notFound) {
    return renderNotFound({
      ...notFoundOptions,
      backLabel,
      backAttribute
    });
  }

  const normalizedFormAttributes =
    Object.entries(
      formAttributes || {}
    )
      .map(
        ([name, value]) => {
          if (
            value === false ||
            value === null ||
            value === undefined
          ) {
            return '';
          }

          if (value === true) {
            return escapeHtml(
              name
            );
          }

          return `${escapeHtml(
            name
          )}="${escapeHtml(
            value
          )}"`;
        }
      )
      .filter(Boolean)
      .join(' ');

  const normalizedHiddenFields =
    Array.isArray(hiddenFields)
      ? hiddenFields
      : [];

  return `
    <section
      class="admin-content-editor"
      data-admin-content-editor
      ${
        editorId
          ? `data-admin-content-editor-id="${escapeHtml(
              editorId
            )}"`
          : ''
      }
    >
      <header
        class="admin-content-editor__header"
      >
        <div
          class="admin-content-editor__heading"
        >
          <button
            type="button"
            class="admin-content-editor__back"
            ${backAttribute}
          >
            <span
              aria-hidden="true"
            >
              ←
            </span>

            <span>
              ${escapeHtml(
                backLabel
              )}
            </span>
          </button>

          <p
            class="admin-section__eyebrow"
          >
            ${escapeHtml(
              eyebrow
            )}
          </p>

          <h1>
            ${escapeHtml(
              title
            )}
          </h1>

          ${
            statusItems.length
              ? `
                <div
                  class="admin-content-editor__status"
                >
                  ${renderStatusItems(
                    statusItems
                  )}
                </div>
              `
              : ''
          }
        </div>

        ${
          headerActions.length
            ? `
              <div
                class="admin-content-editor__header-actions"
              >
                ${renderActions(
                  headerActions
                )}
              </div>
            `
            : ''
        }
      </header>

      <form
        id="${escapeHtml(
          formId
        )}"
        class="admin-content-editor__form"
        novalidate
        ${normalizedFormAttributes}
      >
        ${normalizedHiddenFields
          .map(field => `
            <input
              type="hidden"
              name="${escapeHtml(
                field.name
              )}"
              value="${escapeHtml(
                field.value
              )}"
            >
          `)
          .join('')}

        ${renderPanels(
          panels
        )}

        <footer
          class="admin-content-editor__footer"
        >
          <div
            class="admin-content-editor__footer-left"
          >
            ${renderActions(
              footerLeftActions
            )}
          </div>

          <div
            class="admin-content-editor__footer-right"
          >
            ${renderActions(
              footerRightActions
            )}
          </div>
        </footer>
      </form>
    </section>
  `;
}

export {
  escapeHtml,
  renderActionButton,
  renderActions,
  renderPanel,
  renderPanels,
  renderNotFound
};

export default renderAdminContentEditor;
