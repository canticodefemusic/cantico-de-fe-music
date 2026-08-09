/**
 * Cántico de Fe Music
 * V13.12.5 — Media Selection Controller
 *
 * Funciones:
 * - Puente entre UI y MediaSelectionService
 * - Selección individual
 * - Toggle
 * - Selección por rango
 * - Seleccionar visibles
 * - Reemplazar selección completa
 * - Sincronizar selección R2 existente
 * - Limpiar selección
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
  /* Utilidades                                                         */
  /* ------------------------------------------------------------------ */

  normalizeKeys(
    keys = []
  ) {
    return Array.isArray(
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
  }

  /* ------------------------------------------------------------------ */
  /* Orden visible                                                      */
  /* ------------------------------------------------------------------ */

  setOrderedKeys(
    keys = []
  ) {
    this.orderedKeys =
      this.normalizeKeys(
        keys
      );

    return this.getOrderedKeys();
  }

  getOrderedKeys() {
    return [
      ...this.orderedKeys
    ];
  }

  /* ------------------------------------------------------------------ */
  /* Reemplazar / sincronizar selección                                 */
  /* ------------------------------------------------------------------ */

  replaceSelection(
    keys = [],
    {
      emitChange = false
    } = {}
  ) {
    const normalizedKeys =
      this.normalizeKeys(
        keys
      );

    this.service.selectAll(
      normalizedKeys,
      {
        replace:
          true,

        emitChange
      }
    );

    this.lastSelectedKey =
      normalizedKeys.length
        ? normalizedKeys[
            normalizedKeys.length - 1
          ]
        : null;

    return this.getSelectedKeySet();
  }

  syncFromSet(
    selectedKeys,
    options = {}
  ) {
    const keys =
      selectedKeys instanceof Set
        ? [
            ...selectedKeys
          ]
        : Array.isArray(
            selectedKeys
          )
          ? selectedKeys
          : [];

    return this.replaceSelection(
      keys,
      options
    );
  }

  /* ------------------------------------------------------------------ */
  /* Selección individual                                               */
  /* ------------------------------------------------------------------ */

  select(
    key,
    {
      additive = false,
      emitChange = true
    } = {}
  ) {
    if (!key) {
      return false;
    }

    const result =
      this.service.select(
        key,
        {
          additive,
          emitChange
        }
      );

    if (
      result?.success
    ) {
      this.lastSelectedKey =
        String(
          key
        );
    }

    return Boolean(
      result?.success
    );
  }

  deselect(
    key,
    {
      emitChange = true
    } = {}
  ) {
    if (!key) {
      return false;
    }

    const result =
      this.service.deselect(
        key,
        {
          emitChange
        }
      );

    if (
      this.lastSelectedKey ===
      String(
        key
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

  toggle(
    key,
    {
      additive = true,
      emitChange = true
    } = {}
  ) {
    if (!key) {
      return false;
    }

    const result =
      this.service.toggle(
        key,
        {
          additive,
          emitChange
        }
      );

    if (
      result?.success
    ) {
      this.lastSelectedKey =
        this.service.isSelected(
          key
        )
          ? String(
              key
            )
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
      additive = true,
      emitChange = true
    } = {}
  ) {
    if (!key) {
      return false;
    }

    if (selected) {
      return this.select(
        key,
        {
          additive,
          emitChange
        }
      );
    }

    return this.deselect(
      key,
      {
        emitChange
      }
    );
  }

  /* ------------------------------------------------------------------ */
  /* Selección por rango                                                */
  /* ------------------------------------------------------------------ */

  selectRange(
  toKey,
  {
    fromKey = null,
    additive = false,
    emitChange = true,
    preserveAnchor = true
  } = {}
) {
  const endKey =
    String(
      toKey || ''
    ).trim();

  if (!endKey) {
    return false;
  }

  const startKey =
    String(
      fromKey ||
      this.lastSelectedKey ||
      this.service
        .getLastSelectedId?.() ||
      ''
    ).trim();

  if (!startKey) {
    return this.select(
      endKey,
      {
        additive,
        emitChange
      }
    );
  }

  const result =
    this.service.selectRange({
      orderedIds:
        this.orderedKeys,

      fromId:
        startKey,

      toId:
        endKey,

      additive,

      emitChange
    });

  if (
    !result?.success
  ) {
    return false;
  }

  /*
   * Para Shift + Click conservamos
   * el archivo inicial como ancla.
   *
   * Así varios Shift + Click siguen
   * extendiendo el rango desde el
   * mismo punto inicial.
   */
  this.lastSelectedKey =
    preserveAnchor
      ? startKey
      : endKey;

  return true;
}

  /* ------------------------------------------------------------------ */
  /* Seleccionar visibles                                               */
  /* ------------------------------------------------------------------ */

  selectVisible({
    replace = false,
    emitChange = true
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
          replace,
          emitChange
        }
      );

    if (
      result?.success
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

  clear({
    emitChange = true
  } = {}) {
    const result =
      this.service.clear({
        emitChange
      });

    this.lastSelectedKey =
      null;

    return Boolean(
      result?.success
    );
  }

  /* ------------------------------------------------------------------ */
  /* Sincronización                                                     */
  /* ------------------------------------------------------------------ */

  prune(
    validKeys = [],
    {
      emitChange = false
    } = {}
  ) {
    const result =
      this.service.prune(
        this.normalizeKeys(
          validKeys
        ),
        {
          emitChange
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
  /* Consultas                                                          */
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
  /* Ciclo de vida                                                      */
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
