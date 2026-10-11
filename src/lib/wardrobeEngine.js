import { v4 as uuidv4 } from 'uuid';

/**
 * Converts a hex color string to HSL values
 * @param {string} hex
 * @returns {{ h: number, s: number, l: number }}
 */
function hexToHsl(hex) {
  if (!hex || typeof hex !== 'string') {
    return { h: 0, s: 0, l: 0.5 };
  }

  let sanitized = hex.replace('#', '').trim();
  if (sanitized.length === 3) {
    sanitized = sanitized.split('').map((c) => c + c).join('');
  }

  if (sanitized.length !== 6) {
    return { h: 0, s: 0, l: 0.5 };
  }

  const r = parseInt(sanitized.substring(0, 2), 16) / 255;
  const g = parseInt(sanitized.substring(2, 4), 16) / 255;
  const b = parseInt(sanitized.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h = h * 60;
  }

  return { h: Math.round(h), s, l };
}

/**
 * Determines whether a color is considered a versatile neutral
 * (Black, White, Greys, Beiges, Creams, Navy, Deep Brown, low saturation)
 * @param {string} hex
 * @param {{ h: number, s: number, l: number }} hsl
 * @returns {boolean}
 */
function isNeutral(hex, hsl) {
  if (!hex) return true;
  const normalized = hex.toUpperCase();
  const knownNeutrals = [
    '#FFFFFF', '#000000', '#1E3A5F', '#92400E',
    '#F5F5DC', '#6B7280', '#FFFDD0', '#E5E7EB',
    '#374151', '#111827', '#F3F4F6', '#D1D5DB'
  ];

  if (knownNeutrals.includes(normalized)) return true;

  // Very low saturation (greys/whites/blacks) or extreme lightness
  if (hsl.s < 0.18) return true;
  if (hsl.l < 0.12 || hsl.l > 0.90) return true;

  return false;
}

/**
 * Calculates a harmony score (0 - 10) between two colors using HSL wheel distance
 * @param {string} color1Hex
 * @param {string} color2Hex
 * @returns {number}
 */
export function getColorHarmonyScore(color1Hex, color2Hex) {
  if (!color1Hex || !color2Hex) return 8;

  const hsl1 = hexToHsl(color1Hex);
  const hsl2 = hexToHsl(color2Hex);

  // Neutrals harmonize effortlessly with almost any color
  if (isNeutral(color1Hex, hsl1) || isNeutral(color2Hex, hsl2)) {
    return 8.5;
  }

  let hueDiff = Math.abs(hsl1.h - hsl2.h) % 360;
  if (hueDiff > 180) {
    hueDiff = 360 - hueDiff;
  }

  // Complementary (~180°)
  if (hueDiff >= 150 && hueDiff <= 180) {
    return 10;
  }

  // Analogous (~30°)
  if (hueDiff >= 20 && hueDiff <= 45) {
    return 8.8;
  }

  // Monochromatic (< 15°)
  if (hueDiff < 15) {
    const lDiff = Math.abs(hsl1.l - hsl2.l);
    // Contrast in lightness within same hue looks great
    return lDiff > 0.2 ? 8.5 : 7.8;
  }

  // Triadic (~120°)
  if (hueDiff >= 105 && hueDiff <= 135) {
    return 7.5;
  }

  // Split complementary (~150°)
  if (hueDiff > 135 && hueDiff < 150) {
    return 7.2;
  }

  // Default moderate harmony
  return 6.0;
}

/**
 * Generates outfit reason description
 */
function createOutfitReason(colorScore, isEthnicOutfit, occasion, favoriteCount, freshCount) {
  if (isEthnicOutfit) {
    if (colorScore >= 8) {
      return `Traditional elegance with cohesive color tones, perfect for ${occasion}.`;
    }
    return `Festive traditional silhouette tailored for ${occasion}.`;
  }

  if (colorScore >= 9) {
    return `Striking complementary color harmony creating a polished, intentional look.`;
  } else if (colorScore >= 8) {
    return `Balanced neutral & harmonious tones suited for a sharp ${occasion} style.`;
  } else if (favoriteCount > 0) {
    return `Curated around your wardrobe favorites for effortless confidence.`;
  } else if (freshCount > 0) {
    return `Features pieces you haven't worn recently to keep your rotation fresh.`;
  }

  return `Clean and versatile combination matching your ${occasion} plans.`;
}

/**
 * Core outfit suggestion engine
 * @param {Array} clothes
 * @param {string} occasion
 * @param {string} season
 * @returns {Array} List of outfit objects (up to 6)
 */
export function suggestOutfits(clothes = [], occasion = 'casual', season = 'all') {
  if (!Array.isArray(clothes) || clothes.length === 0) {
    return [];
  }

  const isWeddingOrEthnic = occasion === 'wedding';

  // Helper filter function
  const filterByCriteria = (items, targetOccasion, targetSeason) => {
    return items.filter((item) => {
      const occasionMatch =
        !targetOccasion ||
        (Array.isArray(item.occasions) && item.occasions.includes(targetOccasion));

      const seasonMatch =
        !targetSeason ||
        targetSeason === 'all' ||
        (Array.isArray(item.seasons) &&
          (item.seasons.includes(targetSeason) || item.seasons.includes('all')));

      return occasionMatch && seasonMatch;
    });
  };

  // Step 1: Strict match
  let candidates = filterByCriteria(clothes, occasion, season);

  // Step 2: Relaxed fallback if candidates are insufficient
  if (candidates.length < 2) {
    candidates = filterByCriteria(clothes, occasion, 'all');
  }
  if (candidates.length < 2) {
    candidates = filterByCriteria(clothes, null, season);
  }
  if (candidates.length < 2) {
    candidates = [...clothes];
  }

  // Group candidate items by category
  const categorized = {
    tops: candidates.filter((item) => item.category === 'tops'),
    bottoms: candidates.filter((item) => item.category === 'bottoms'),
    shoes: candidates.filter((item) => item.category === 'shoes'),
    accessories: candidates.filter((item) => item.category === 'accessories'),
    outerwear: candidates.filter((item) => item.category === 'outerwear'),
    ethnic: candidates.filter((item) => item.category === 'ethnic'),
  };

  // Fallback to pool if certain key categories are empty in candidate pool
  ['tops', 'bottoms', 'shoes', 'ethnic', 'outerwear', 'accessories'].forEach((cat) => {
    if (categorized[cat].length === 0) {
      categorized[cat] = clothes.filter((item) => item.category === cat);
    }
  });

  const rawOutfits = [];

  // Helper to pick up to 2 accessories
  const pickAccessories = (accList, baseColor) => {
    if (!accList || accList.length === 0) return [];
    const sorted = [...accList].sort((a, b) => {
      const harmA = getColorHarmonyScore(baseColor, a.color);
      const harmB = getColorHarmonyScore(baseColor, b.color);
      return harmB - harmA;
    });
    return sorted.slice(0, 2);
  };

  // Helper to pick best outerwear if appropriate
  const pickOuterwear = (outList, baseColor) => {
    if (!outList || outList.length === 0) return null;
    if (season === 'summer') return null; // usually omit outerwear in summer unless party/formal
    const sorted = [...outList].sort((a, b) => {
      return getColorHarmonyScore(baseColor, b.color) - getColorHarmonyScore(baseColor, a.color);
    });
    return sorted[0] || null;
  };

  // 1. Generate Ethnic Combinations (Prioritized if wedding or traditional)
  if (categorized.ethnic.length > 0) {
    categorized.ethnic.forEach((eth) => {
      const shoesList = categorized.shoes.length > 0 ? categorized.shoes : [null];

      shoesList.forEach((shoe) => {
        const baseColor = eth.color;
        const colorScore = shoe ? getColorHarmonyScore(baseColor, shoe.color) : 8;
        const outerwear = (season === 'winter' || occasion === 'wedding') ? pickOuterwear(categorized.outerwear, baseColor) : null;
        const accessories = pickAccessories(categorized.accessories, baseColor);

        // Calculate score
        let score = colorScore * 4; // up to 40
        if (shoe) score += 20; // completeness
        if (accessories.length > 0) score += accessories.length * 4;
        if (outerwear) score += 5;

        // Occasion / season exact match bonus
        const ethMatchesOccasion = Array.isArray(eth.occasions) && eth.occasions.includes(occasion);
        const ethMatchesSeason = Array.isArray(eth.seasons) && (eth.seasons.includes(season) || eth.seasons.includes('all'));
        if (ethMatchesOccasion) score += 10;
        if (ethMatchesSeason) score += 5;
        if (isWeddingOrEthnic) score += 15; // strong preference for wedding

        // Favorites and variety
        const allItems = [eth, shoe, outerwear, ...accessories].filter(Boolean);
        const favCount = allItems.filter((i) => i.favorite).length;
        score += favCount * 4;

        const avgWear = allItems.reduce((acc, curr) => acc + (curr.timesWorn || 0), 0) / allItems.length;
        score += Math.max(0, 10 - avgWear);

        rawOutfits.push({
          id: uuidv4(),
          top: null,
          bottom: null,
          shoes: shoe,
          accessories,
          outerwear,
          ethnic: eth,
          score: Math.min(99, Math.round(score)),
          reason: createOutfitReason(colorScore, true, occasion, favCount, avgWear < 2 ? 1 : 0),
        });
      });
    });
  }

  // 2. Generate Western Combinations (top + bottom + shoes)
  if (categorized.tops.length > 0 && categorized.bottoms.length > 0) {
    categorized.tops.forEach((top) => {
      categorized.bottoms.forEach((bottom) => {
        const topBottomHarm = getColorHarmonyScore(top.color, bottom.color);

        const shoesList = categorized.shoes.length > 0 ? categorized.shoes : [null];

        // Evaluate top 2 shoe matches for this top+bottom to avoid cartesian explosion
        const evaluatedShoes = [...shoesList].map((shoe) => {
          const shoeHarm = shoe
            ? (getColorHarmonyScore(shoe.color, bottom.color) + getColorHarmonyScore(shoe.color, top.color)) / 2
            : 7;
          return { shoe, shoeHarm };
        }).sort((a, b) => b.shoeHarm - a.shoeHarm).slice(0, 2);

        evaluatedShoes.forEach(({ shoe, shoeHarm }) => {
          const outerwear = (season === 'winter' || season === 'monsoon' || occasion === 'formal')
            ? pickOuterwear(categorized.outerwear, top.color)
            : null;
          const accessories = pickAccessories(categorized.accessories, top.color);

          let score = topBottomHarm * 3.5 + shoeHarm * 1.5; // up to 50
          if (shoe) score += 15;
          if (accessories.length > 0) score += accessories.length * 3;
          if (outerwear) score += 5;

          const topMatchesOccasion = Array.isArray(top.occasions) && top.occasions.includes(occasion);
          const bottomMatchesOccasion = Array.isArray(bottom.occasions) && bottom.occasions.includes(occasion);
          if (topMatchesOccasion) score += 5;
          if (bottomMatchesOccasion) score += 5;

          const topMatchesSeason = Array.isArray(top.seasons) && (top.seasons.includes(season) || top.seasons.includes('all'));
          const bottomMatchesSeason = Array.isArray(bottom.seasons) && (bottom.seasons.includes(season) || bottom.seasons.includes('all'));
          if (topMatchesSeason) score += 3;
          if (bottomMatchesSeason) score += 3;

          // Favorites and wear variety
          const allItems = [top, bottom, shoe, outerwear, ...accessories].filter(Boolean);
          const favCount = allItems.filter((i) => i.favorite).length;
          score += favCount * 3.5;

          const avgWear = allItems.reduce((acc, curr) => acc + (curr.timesWorn || 0), 0) / allItems.length;
          score += Math.max(0, 10 - avgWear);

          if (!isWeddingOrEthnic) {
            score += 10;
          }

          rawOutfits.push({
            id: uuidv4(),
            top,
            bottom,
            shoes: shoe,
            accessories,
            outerwear,
            ethnic: null,
            score: Math.min(99, Math.round(score)),
            reason: createOutfitReason(topBottomHarm, false, occasion, favCount, avgWear < 2 ? 1 : 0),
          });
        });
      });
    });
  }

  // Fallback if no full outfits could be generated (e.g. only tops or only bottoms or only shoes)
  if (rawOutfits.length === 0) {
    const anyTop = categorized.tops[0] || null;
    const anyBottom = categorized.bottoms[0] || null;
    const anyShoe = categorized.shoes[0] || null;
    const anyEthnic = categorized.ethnic[0] || null;

    if (anyTop || anyBottom || anyEthnic) {
      rawOutfits.push({
        id: uuidv4(),
        top: anyEthnic ? null : anyTop,
        bottom: anyEthnic ? null : anyBottom,
        shoes: anyShoe,
        accessories: [],
        outerwear: null,
        ethnic: anyEthnic || null,
        score: 75,
        reason: `Available wardrobe pieces selected for ${occasion}. Add more clothes to unlock smarter pairings!`,
      });
    }
  }

  // Deduplicate outfits that have identical top/bottom/ethnic and shoes
  const uniqueMap = new Map();
  for (const outfit of rawOutfits) {
    const key = outfit.ethnic
      ? `eth:${outfit.ethnic.id}-sh:${outfit.shoes?.id || 'none'}`
      : `t:${outfit.top?.id || 'none'}-b:${outfit.bottom?.id || 'none'}-sh:${outfit.shoes?.id || 'none'}`;

    if (!uniqueMap.has(key) || uniqueMap.get(key).score < outfit.score) {
      uniqueMap.set(key, outfit);
    }
  }

  // Sort by score descending and return top 6
  const sortedOutfits = Array.from(uniqueMap.values()).sort((a, b) => b.score - a.score);
  return sortedOutfits.slice(0, 6);
}
