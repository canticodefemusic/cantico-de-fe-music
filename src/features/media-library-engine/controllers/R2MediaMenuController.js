/**
 * Cántico de Fe Music
 * V13.7.3 — R2 Media Menu Controller
 *
 * Funciones:
 * - Solo un menú abierto a la vez
 * - Cerrar al hacer clic fuera
 * - Cerrar con tecla Escape
 * - Cerrar después de ejecutar una acción
 * - Manejo seguro dentro del Media Library
 */

export class R2MediaMenuController {

  constructor({
    root = null
  } = {}) {
    this.root =
      root;

    this.initialized =
      false;

    this.handleToggle =
      this.handleToggle.bind(
        this
      );

    this.handleDocumentClick =
      this.handleDocumentClick.bind(
        this
      );

    this.handleKeyDown =
      this.handleKeyDown.bind(
        this
      );

    this.handleRootClick =
      this.handleRootClick.bind(
        this
      );
  }

  init() {
    if (
      !this.root ||
      this.initialized
    ) {
      return false;
    }

    /*
     * "toggle" detecta cuándo un
     * <details> abre o cierra.
     *
     * Usamos capture=true porque
     * toggle no siempre se comporta
     * como un evento normal con
     * bubbling.
     */
    this.root.addEventListener(
      'toggle',
      this.handleToggle,
      true
    );

    this.root.addEventListener(
      'click',
      this.handleRootClick
    );

    document.addEventListener(
      'click',
      this.handleDocumentClick
    );

    document.addEventListener(
      'keydown',
      this.handleKeyDown
    );

    this.initialized =
      true;

    return true;
  }

  handleToggle(
    event
  ) {
    const menu =
      event.target;

    if (
      !(menu instanceof HTMLDetailsElement) ||
      !menu.matches(
        '[data-media-menu]'
      ) ||
      !menu.open
    ) {
      return;
    }

    /*
     * Cuando abre un menú,
     * cerramos todos los demás.
     */
    this.closeAll({
      except:
        menu
    });
  }

  handleDocumentClick(
    event
  ) {
    if (!this.root) {
      return;
    }

    const target =
      event.target;

    if (
      !(target instanceof Element)
    ) {
      return;
    }

    /*
     * Si el click ocurrió dentro
     * de cualquier menú, no hacemos
     * nada aquí.
     */
    if (
      target.closest(
        '[data-media-menu]'
      )
    ) {
      return;
    }

    this.closeAll();
  }

  handleRootClick(
    event
  ) {
    const target =
      event.target;

    if (
      !(target instanceof Element)
    ) {
      return;
    }

    /*
     * Después de ejecutar una acción
     * del menú, lo cerramos.
     *
     * Conservamos los mismos data-*
     * utilizados por el controlador
     * principal.
     */
    const action =
      target.closest(
        [
          '[data-media-preview]',
          '[data-media-copy]',
          '[data-media-download]',
          '[data-media-delete]'
        ].join(',')
      );

    if (!action) {
      return;
    }

    const menu =
      action.closest(
        '[data-media-menu]'
      );

    if (
      menu instanceof
        HTMLDetailsElement
    ) {
      /*
       * Permitimos que el evento
       * original continúe.
       *
       * El controlador R2 podrá
       * procesar copiar o eliminar
       * normalmente.
       */
      window.requestAnimationFrame(
        () => {
          menu.open =
            false;
        }
      );
    }
  }

  handleKeyDown(
    event
  ) {
    if (
      event.key !==
      'Escape'
    ) {
      return;
    }

    const openMenu =
      this.getOpenMenus()[0];

    if (!openMenu) {
      return;
    }

    const trigger =
      openMenu.querySelector(
        '.media-library-item__menu-trigger'
      );

    openMenu.open =
      false;

    /*
     * Regresamos el foco al botón ⋮
     * para mejorar accesibilidad.
     */
    if (
      trigger instanceof
        HTMLElement
    ) {
      trigger.focus();
    }
  }

  getMenus() {
    if (!this.root) {
      return [];
    }

    return [
      ...this.root.querySelectorAll(
        '[data-media-menu]'
      )
    ];
  }

  getOpenMenus() {
    return this.getMenus()
      .filter(
        menu =>
          menu instanceof
            HTMLDetailsElement &&
          menu.open
      );
  }

  closeAll({
    except = null
  } = {}) {
    this.getOpenMenus()
      .forEach(
        menu => {
          if (
            menu ===
            except
          ) {
            return;
          }

          menu.open =
            false;
        }
      );
  }

  destroy() {
    if (
      !this.initialized
    ) {
      return;
    }

    if (this.root) {
      this.root.removeEventListener(
        'toggle',
        this.handleToggle,
        true
      );

      this.root.removeEventListener(
        'click',
        this.handleRootClick
      );
    }

    document.removeEventListener(
      'click',
      this.handleDocumentClick
    );

    document.removeEventListener(
      'keydown',
      this.handleKeyDown
    );

    this.closeAll();

    this.root =
      null;

    this.initialized =
      false;
  }

}

export default
  R2MediaMenuController;
