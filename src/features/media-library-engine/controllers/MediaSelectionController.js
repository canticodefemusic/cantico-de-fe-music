/**
 * Cántico de Fe Music
 * V13.12.1 — Media Selection Controller
 *
 * Funciones:
 * - Puente entre la UI y MediaSelectionService
 * - Selección individual
 * - Toggle
 * - Selección por rango
 * - Seleccionar visibles
 * - Limpiar selección
 * - Sincronizar selección válida
 * - Preparado para Shift + Click
 * - Preparado para Ctrl / Cmd + Click
 */

import MediaSelectionService
  from '../services/MediaSelectionService.js';

export class MediaSelectionController {

  constructor({
    service =
      MediaSelectionService
  } = {}) {
    this.service =
      service;

    this.orderedKeys =
      [];

    this.lastSelectedKey =
      null;
  }

  /* ------------------------------------------------------------------ */
  /* Orden visible                                                       */
  /* ------------------------------------------------------------------ */

  setOrderedKeys(
    keys = []
  ) {
    this.orderedKeys =
      Array.isArray(
        keys
      )
        ? keys
            .map(
              key =>
                String(
                  key || ''
                ).trim()
            )
            .filter(
              Boolean
            )
        : [];

    this.prune();

    return this.getSelectedKeys();
  }

  getOrderedKeys() {
    return [
      ...this.orderedKeys
    ];
  }

  /* ------------------------------------------------------------------ */
  /* Selección individual                                                */
  /* ------------------------------------------------------------------ */

  select(
    key,
    {
      additive = false
    } = {}
  ) {
    if (!key) {
      return false;
    }

    const result =
      this.service.select(
        key,
        {
          additive
        }
      );

    if (
      result?.success
    ) {
      this.lastSelectedKey =
        String(key);
    }

    return Boolean(
      result?.success
    );
  }

  deselect(
    key
  ) {
    if (!key) {
      return false;
    }

    const result =
      this.service.deselect(
        key
      );

    if (
      this.lastSelectedKey ===
      String(key)
    ) {
      this.lastSelectedKey =
        this.service
          .getLastSelectedId?.() ||
        null;
    }

    return Boolean(
      result?.success
    );
  }

  toggle(
    key,
    {
      additive = true
    } = {}
  ) {
    if (!key) {
      return false;
    }

    const result =
      this.service.toggle(
        key,
        {
          additive
        }
      );

    if (
      result?.success
    ) {
      this.lastSelectedKey =
        this.service
          .isSelected(
            key
          )
          ? String(key)
          : this.service
              .getLastSelectedId?.() ||
            null;
    }

    return Boolean(
      result?.success
    );
  }

  setSelected(
    key,
    selected = true,
    {
      additive = true
    } = {}
  ) {
    if (!key) {
      return false;
    }

    if (selected) {
      return this.select(
        key,
        {
          additive
        }
      );
    }

    return this.deselect(
      key
    );
  }

  /* ------------------------------------------------------------------ */
  /* Selección por rango                                                 */
  /* ------------------------------------------------------------------ */

  selectRange(
    toKey,
    {
      additive = false
    } = {}
  ) {
    const endKey =
      String(
        toKey || ''
      ).trim();

    if (!endKey) {
      return false;
    }

    const fromKey =
      this.lastSelectedKey ||
      this.service
        .getLastSelectedId?.();

    if (!fromKey) {
      return this.select(
        endKey,
        {
          additive
        }
      );
    }

    const result =
      this.service.selectRange({
        orderedIds:
          this.orderedKeys,

        fromId:
          fromKey,

        toId:
          endKey,

        additive
      });

    if (
      result?.success
    ) {
      this.lastSelectedKey =
        endKey;
    }

    return Boolean(
      result?.success
    );
  }

  /* ------------------------------------------------------------------ */
  /* Seleccionar visibles                                                */
  /* ------------------------------------------------------------------ */

  selectVisible({
    replace = false
  } = {}) {
    if (
      !this.orderedKeys.length
    ) {
      return false;
    }

    const result =
      this.service.selectAll(
        this.orderedKeys,
        {
          replace
        }
      );

    if (
      result?.success &&
      this.orderedKeys.length
    ) {
      this.lastSelectedKey =
        this.orderedKeys[
          this.orderedKeys.length - 1
        ];
    }

    return Boolean(
      result?.success
    );
  }

  /* ------------------------------------------------------------------ */
  /* Limpiar                                                            */
  /* ------------------------------------------------------------------ */

  clear() {
    const result =
      this.service.clear();

    this.lastSelectedKey =
      null;

    return Boolean(
      result?.success
    );
  }

  /* ------------------------------------------------------------------ */
  /* Sincronización                                                      */
  /* ------------------------------------------------------------------ */

  prune(
    validKeys =
      this.orderedKeys
  ) {
    const result =
      this.service.prune(
        validKeys,
        {
          emitChange:
            false
        }
      );

    if (
      this.lastSelectedKey &&
      !this.service.isSelected(
        this.lastSelectedKey
      )
    ) {
      this.lastSelectedKey =
        this.service
          .getLastSelectedId?.() ||
        null;
    }

    return Boolean(
      result?.success
    );
  }

  /* ------------------------------------------------------------------ */
  /* Consultas                                                           */
  /* ------------------------------------------------------------------ */

  isSelected(
    key
  ) {
    return this.service
      .isSelected(
        key
      );
  }

  hasSelection() {
    return this.service
      .hasSelection();
  }

  getSelectedCount() {
    return this.service
      .getCount();
  }

  getSelectedKeys() {
    return this.service
      .getSelectedIds();
  }

  getSelectedKeySet() {
    return new Set(
      this.getSelectedKeys()
    );
  }

  getLastSelectedKey() {
    return (
      this.lastSelectedKey ||
      this.service
        .getLastSelectedId?.() ||
      null
    );
  }

  getSnapshot() {
    return this.service
      .getSnapshot();
  }

  /* ------------------------------------------------------------------ */
  /* Ciclo de vida                                                       */
  /* ------------------------------------------------------------------ */

  destroy() {
    this.orderedKeys =
      [];

    this.lastSelectedKey =
      null;
  }

}

export default
  MediaSelectionController;
