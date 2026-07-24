const STORAGE_KEY = 'cantico:favorites';

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(favorites)
  );
}

export function getFavorites() {
  return loadFavorites();
}

export function isFavorite(id) {
  return loadFavorites().includes(id);
}

export function toggleFavorite(id) {
  const favorites = loadFavorites();

  const index = favorites.indexOf(id);

  if (index >= 0) {
    favorites.splice(index, 1);
  } else {
    favorites.push(id);
  }

  saveFavorites(favorites);

  return favorites;
}
