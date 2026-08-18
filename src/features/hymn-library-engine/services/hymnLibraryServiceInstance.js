/**
 * Cántico de Fe Music
 * V13.4.34 — Shared Hymn Library Service
 *
 * Una sola instancia de HymnLibraryService
 * para toda la aplicación.
 */

import {
  HymnLibraryService
} from './HymnLibraryService.js';

export const hymnLibraryService =
  new HymnLibraryService();

export default
  hymnLibraryService;
