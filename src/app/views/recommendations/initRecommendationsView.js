import { initHymnLibrary } from '../../../features/hymn-library-engine/index.js';

export function initRecommendationsView() {
  initHymnLibrary({
    onPlay: hymn => {
      window.dispatchEvent(
        new CustomEvent('cantico:hymn-play', {
          detail: hymn
        })
      );
    }
  });
}

export default initRecommendationsView;
