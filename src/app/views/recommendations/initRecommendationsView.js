import { hymnCatalog } from '../../../features/hymn-library-engine/data/hymnCatalog.js';

export function initRecommendationsView() {
  document
    .querySelectorAll('[data-recommendation-play]')
    .forEach(button => {
      button.addEventListener('click', () => {
        const hymnId = button.dataset.recommendationPlay;

        const hymn = hymnCatalog.find(
          item => item.id === hymnId
        );

        if (!hymn) {
          return;
        }

        window.dispatchEvent(
          new CustomEvent('cantico:hymn-play', {
            detail: hymn
          })
        );
      });
    });
}

export default initRecommendationsView;
