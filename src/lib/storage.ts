const FAVORITES_KEY = 'favorites';
const WATCHED_KEY = 'watched';

function getList(key: string): string[] {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

function setList(key: string, list: string[]) {
  localStorage.setItem(key, JSON.stringify(list));
}

export function getFavorites() {
  return getList(FAVORITES_KEY);
}

export function toggleFavorite(id: string) {
  const list = getFavorites();
  if (list.includes(id)) {
    setList(FAVORITES_KEY, list.filter((x) => x !== id));
  } else {
    setList(FAVORITES_KEY, [...list, id]);
  }
}

export function isFavorite(id: string) {
  return getFavorites().includes(id);
}

export function getWatched() {
  return getList(WATCHED_KEY);
}

export function markWatched(id: string) {
  const list = getWatched();
  if (!list.includes(id)) {
    setList(WATCHED_KEY, [...list, id]);
  }
}

export function isWatched(id: string) {
  return getWatched().includes(id);
}
