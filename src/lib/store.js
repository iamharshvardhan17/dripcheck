const STORAGE_KEY = 'wardrobe_clothes';

/**
 * Safe retrieval of clothes array from localStorage
 * @returns {Array} clothes array
 */
export function getClothes() {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to read wardrobe from localStorage:', error);
    return [];
  }
}

/**
 * Save clothes array to localStorage
 * @param {Array} clothes
 */
export function saveClothes(clothes) {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(clothes || []));
  } catch (error) {
    console.error('Failed to save wardrobe to localStorage:', error);
  }
}

/**
 * Add a new clothing item
 * @param {Object} cloth
 * @returns {Array} updated clothes array
 */
export function addCloth(cloth) {
  const current = getClothes();
  const newItem = {
    ...cloth,
    favorite: Boolean(cloth.favorite),
    timesWorn: Number.isFinite(cloth.timesWorn) ? cloth.timesWorn : 0,
    dateAdded: cloth.dateAdded || new Date().toISOString(),
  };
  const updated = [newItem, ...current];
  saveClothes(updated);
  return updated;
}

/**
 * Update an existing clothing item by id
 * @param {string} id
 * @param {Object} updates
 * @returns {Array} updated clothes array
 */
export function updateCloth(id, updates) {
  const current = getClothes();
  const updated = current.map((item) => {
    if (item.id === id) {
      return { ...item, ...updates };
    }
    return item;
  });
  saveClothes(updated);
  return updated;
}

/**
 * Delete a clothing item by id
 * @param {string} id
 * @returns {Array} updated clothes array
 */
export function deleteCloth(id) {
  const current = getClothes();
  const updated = current.filter((item) => item.id !== id);
  saveClothes(updated);
  return updated;
}

/**
 * Toggle favorite status of a clothing item
 * @param {string} id
 * @returns {Array} updated clothes array
 */
export function toggleFavorite(id) {
  const current = getClothes();
  const updated = current.map((item) => {
    if (item.id === id) {
      return { ...item, favorite: !item.favorite };
    }
    return item;
  });
  saveClothes(updated);
  return updated;
}

/**
 * Increment the wear count of a clothing item
 * @param {string} id
 * @returns {Array} updated clothes array
 */
export function incrementWear(id) {
  const current = getClothes();
  const updated = current.map((item) => {
    if (item.id === id) {
      return { ...item, timesWorn: (item.timesWorn || 0) + 1 };
    }
    return item;
  });
  saveClothes(updated);
  return updated;
}

/**
 * Calculate wardrobe statistics
 * @returns {{ total: number, byCategory: Record<string, number>, favorites: number, recentlyAdded: Array }}
 */
export function getStats() {
  const clothes = getClothes();

  const byCategory = {
    tops: 0,
    bottoms: 0,
    shoes: 0,
    accessories: 0,
    outerwear: 0,
    ethnic: 0,
  };

  let favorites = 0;

  clothes.forEach((item) => {
    if (item.category && byCategory[item.category] !== undefined) {
      byCategory[item.category] += 1;
    } else if (item.category) {
      byCategory[item.category] = (byCategory[item.category] || 0) + 1;
    }

    if (item.favorite) {
      favorites += 1;
    }
  });

  // Sort by dateAdded descending to get recent items
  const sortedByRecent = [...clothes].sort((a, b) => {
    const dateA = new Date(a.dateAdded || 0).getTime();
    const dateB = new Date(b.dateAdded || 0).getTime();
    return dateB - dateA;
  });

  return {
    total: clothes.length,
    byCategory,
    favorites,
    recentlyAdded: sortedByRecent.slice(0, 5),
  };
}
