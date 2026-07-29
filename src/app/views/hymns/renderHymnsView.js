import {
  renderHymnLibrary,
  renderHymnDetail
} from '../../../features/hymn-library-engine/index.js';

export function renderHymnsView(route = {}) {
  return route.id
    ? renderHymnDetail(route.id)
    : renderHymnLibrary();
}
