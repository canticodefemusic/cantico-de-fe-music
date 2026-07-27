import {
  renderHymnLibrary,
  renderHymnDetail
} from '../../../features/hymn-library-engine/index.js';

export function renderHymnsView(route) {
  if (route.id) {
    return renderHymnDetail(route.id);
  }

  return renderHymnLibrary();
}
