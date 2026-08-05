/**
 * Cántico de Fe Music
 * V12.8.1 — Media Library Service
 */

import mediaLibraryData
  from '../data/mediaLibraryData.js';

function normalizeText(text = '') {
  return String(text)
    .toLowerCase()
    .trim();
}

function sortMedia(items) {
  return [...items].sort(
    (a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }

      return a.name.localeCompare(
        b.name
      );
    }
  );
}

const MediaLibraryService = {
  getAll() {
    return sortMedia(
      mediaLibraryData
    );
  },

  getById(id) {
    return mediaLibraryData.find(
      item => item.id === id
    ) || null;
  },

  getByType(type) {
    return sortMedia(
      mediaLibraryData.filter(
        item =>
          item.type === type
      )
    );
  },

  getByCategory(category) {
    return sortMedia(
      mediaLibraryData.filter(
        item =>
          item.category ===
          category
      )
    );
  },

  getFeatured() {
    return sortMedia(
      mediaLibraryData.filter(
        item =>
          item.featured
      )
    );
  },

  search(query = '') {
    const search =
      normalizeText(query);

    if (!search) {
      return this.getAll();
    }

    return sortMedia(
      mediaLibraryData.filter(
        item => {
          const haystack = [
            item.name,
            item.description,
            item.type,
            item.category,
            ...(item.tags || [])
          ]
            .join(' ')
            .toLowerCase();

          return haystack.includes(
            search
          );
        }
      )
    );
  }
};

export default
  MediaLibraryService;
