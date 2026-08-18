/**
 * Cántico de Fe Music
 * V13.8.2 — Media View Mode Controller
 *
 * Controla:
 * - Grid
 * - List
 * - Persistencia local
 */

const STORAGE_KEY =
  'cantico:media-view-mode';

export class MediaViewModeController {

  constructor({
    root = null,
    onChange = null
  } = {}) {

    this.root =
      root;

    this.onChange =
      onChange;

    this.mode =
      this.load();

    this.handleClick =
      this.handleClick.bind(
        this
      );
  }

  init() {

    if (!this.root) {
      return;
    }

    this.root.addEventListener(
      'click',
      this.handleClick
    );

    this.updateButtons();
  }

  destroy() {

    if (!this.root) {
      return;
    }

    this.root.removeEventListener(
      'click',
      this.handleClick
    );
  }

  handleClick(
    event
  ) {

    const button =
      event.target.closest(
        '[data-media-view]'
      );

    if (!button) {
      return;
    }

    const mode =
      button.getAttribute(
        'data-media-view'
      );

    if (
      mode !== 'grid' &&
      mode !== 'list'
    ) {
      return;
    }

    if (
      mode === this.mode
    ) {
      return;
    }

    this.mode =
      mode;

    this.save();

    this.updateButtons();

    this.onChange?.(
      this.mode
    );
  }

  updateButtons() {

    this.root
      ?.querySelectorAll(
        '[data-media-view]'
      )
      .forEach(
        button => {

          const active =
            button.getAttribute(
              'data-media-view'
            ) ===
            this.mode;

          button.classList.toggle(
            'is-active',
            active
          );

          button.setAttribute(
            'aria-pressed',
            active
          );
        }
      );
  }

  save() {

    localStorage.setItem(
      STORAGE_KEY,
      this.mode
    );
  }

  load() {

    const value =
      localStorage.getItem(
        STORAGE_KEY
      );

    return
      value === 'list'
        ? 'list'
        : 'grid';
  }

  getMode() {

    return this.mode;
  }

}

export default
  MediaViewModeController;
