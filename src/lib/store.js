import { supabase } from './supabase';

const STORAGE_KEY = 'wardrobe_clothes';

/**
 * Safe retrieval of clothes array from localStorage (with cloud background sync)
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
 * Async fetch directly from Supabase Cloud Database
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function fetchClothesFromCloud(userId = 'guest') {
  try {
    const { data, error } = await supabase
      .from('clothes')
      .select('*')
      .order('date_added', { ascending: false });

    if (error) {
      console.warn('Supabase fetch notice (fallback to local):', error.message);
      return getClothes();
    }

    if (data && Array.isArray(data) && data.length > 0) {
      // Map database snake_case to app camelCase
      const mapped = data.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        subcategory: item.subcategory,
        color: item.color,
        colorName: item.color_name,
        occasions: item.occasions || [],
        seasons: item.seasons || [],
        imageUrl: item.image_url || '',
        favorite: Boolean(item.favorite),
        timesWorn: item.times_worn || 0,
        dateAdded: item.date_added,
      }));

      saveClothes(mapped);
      return mapped;
    }
    return getClothes();
  } catch (err) {
    console.warn('Could not sync with Supabase cloud:', err);
    return getClothes();
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
 * Add a new clothing item (saves locally and syncs to Supabase Cloud)
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

  // Sync to Supabase in the background
  if (typeof window !== 'undefined') {
    supabase
      .from('clothes')
      .insert([
        {
          id: newItem.id.length === 36 ? newItem.id : undefined,
          name: newItem.name,
          category: newItem.category,
          subcategory: newItem.subcategory,
          color: newItem.color,
          color_name: newItem.colorName,
          occasions: newItem.occasions || [],
          seasons: newItem.seasons || [],
          image_url: newItem.imageUrl || '',
          favorite: newItem.favorite,
          times_worn: newItem.timesWorn,
        },
      ])
      .then(({ error }) => {
        if (error) console.warn('Supabase cloud insert notice:', error.message);
      })
      .catch((e) => console.warn('Supabase cloud error:', e));
  }

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

  // Sync updates to Supabase
  if (typeof window !== 'undefined') {
    const dbUpdates = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.subcategory !== undefined) dbUpdates.subcategory = updates.subcategory;
    if (updates.color !== undefined) dbUpdates.color = updates.color;
    if (updates.colorName !== undefined) dbUpdates.color_name = updates.colorName;
    if (updates.occasions !== undefined) dbUpdates.occasions = updates.occasions;
    if (updates.seasons !== undefined) dbUpdates.seasons = updates.seasons;
    if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;
    if (updates.favorite !== undefined) dbUpdates.favorite = updates.favorite;
    if (updates.timesWorn !== undefined) dbUpdates.times_worn = updates.timesWorn;

    if (Object.keys(dbUpdates).length > 0) {
      supabase
        .from('clothes')
        .update(dbUpdates)
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.warn('Supabase update notice:', error.message);
        })
        .catch((e) => console.warn('Supabase error:', e));
    }
  }

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

  // Sync delete to Supabase
  if (typeof window !== 'undefined') {
    supabase
      .from('clothes')
      .delete()
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.warn('Supabase delete notice:', error.message);
      })
      .catch((e) => console.warn('Supabase error:', e));
  }

  return updated;
}

/**
 * Toggle favorite status of a clothing item
 * @param {string} id
 * @returns {Array} updated clothes array
 */
export function toggleFavorite(id) {
  const current = getClothes();
  let newStatus = false;
  const updated = current.map((item) => {
    if (item.id === id) {
      newStatus = !item.favorite;
      return { ...item, favorite: newStatus };
    }
    return item;
  });
  saveClothes(updated);

  if (typeof window !== 'undefined') {
    supabase
      .from('clothes')
      .update({ favorite: newStatus })
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.warn('Supabase toggle error:', error.message);
      })
      .catch((e) => console.warn('Supabase error:', e));
  }

  return updated;
}

/**
 * Increment the wear count of a clothing item
 * @param {string} id
 * @returns {Array} updated clothes array
 */
export function incrementWear(id) {
  const current = getClothes();
  let newCount = 1;
  const updated = current.map((item) => {
    if (item.id === id) {
      newCount = (item.timesWorn || 0) + 1;
      return { ...item, timesWorn: newCount };
    }
    return item;
  });
  saveClothes(updated);

  if (typeof window !== 'undefined') {
    supabase
      .from('clothes')
      .update({ times_worn: newCount })
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.warn('Supabase increment wear error:', error.message);
      })
      .catch((e) => console.warn('Supabase error:', e));
  }

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
