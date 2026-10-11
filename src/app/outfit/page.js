'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { getClothes, incrementWear } from '@/lib/store';
import { suggestOutfits } from '@/lib/wardrobeEngine';
import { OCCASIONS, SEASONS } from '@/lib/constants';
import {
  Sparkles,
  Check,
  Shirt,
  Footprints,
  Watch,
  CloudSnow,
  Plus,
  ArrowRight,
  Layers,
  CheckCircle2,
  AlertCircle,
  Scissors,
} from 'lucide-react';

export default function OutfitPage() {
  const [clothes, setClothes] = useState([]);
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [outfits, setOutfits] = useState([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [wornOutfits, setWornOutfits] = useState({});

  // Determine default season based on month
  useEffect(() => {
    const loadedClothes = getClothes();
    setClothes(loadedClothes);

    const month = new Date().getMonth(); // 0 = Jan, 11 = Dec
    if (month >= 3 && month <= 5) {
      setSelectedSeason('summer'); // Apr - Jun
    } else if (month >= 6 && month <= 8) {
      setSelectedSeason('monsoon'); // Jul - Sep
    } else {
      setSelectedSeason('winter'); // Oct - Feb
    }
  }, []);

  const handleGenerate = () => {
    if (!selectedOccasion) return;

    setIsGenerating(true);
    setHasGenerated(true);

    // 500ms UX delay for smooth stylistic feel
    setTimeout(() => {
      const currentClothes = getClothes();
      setClothes(currentClothes);
      const suggestions = suggestOutfits(
        currentClothes,
        selectedOccasion,
        selectedSeason
      );
      setOutfits(suggestions);
      setIsGenerating(false);

      // Smooth scroll to results
      setTimeout(() => {
        const resultsEl = document.getElementById('results-section');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }, 500);
  };

  const handleWearOutfit = (outfitId, outfit) => {
    const items = [
      outfit.ethnic,
      outfit.top,
      outfit.bottom,
      outfit.shoes,
      outfit.outerwear,
      ...(outfit.accessories || []),
    ].filter(Boolean);

    items.forEach((item) => {
      incrementWear(item.id);
    });

    // Refresh clothes data in memory
    setClothes(getClothes());

    // Mark outfit as worn
    setWornOutfits((prev) => ({
      ...prev,
      [outfitId]: true,
    }));
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'tops':
        return <Shirt className="w-4 h-4" />;
      case 'bottoms':
        return <Scissors className="w-4 h-4 rotate-90" />;
      case 'shoes':
        return <Footprints className="w-4 h-4" />;
      case 'accessories':
        return <Watch className="w-4 h-4" />;
      case 'outerwear':
        return <CloudSnow className="w-4 h-4" />;
      case 'ethnic':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <Shirt className="w-4 h-4" />;
    }
  };

  // Mini component to display a clothing piece in the outfit card
  const OutfitItemPiece = ({ item, roleLabel }) => {
    if (!item) {
      return (
        <div className="flex-1 min-w-0 bg-gray-50 border border-dashed border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center text-center h-44">
          <span className="text-xs text-gray-400 font-medium capitalize">
            No {roleLabel}
          </span>
        </div>
      );
    }

    return (
      <div className="flex-1 min-w-0 bg-white border border-gray-100 rounded-xl p-2.5 shadow-xs flex flex-col group hover:border-brand-200 transition-all">
        {/* Image / Swatch Container */}
        <div className="w-full h-28 rounded-lg overflow-hidden relative bg-gray-50 flex items-center justify-center border border-gray-100">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center relative p-2"
              style={{
                backgroundColor: item.color || '#F3F4F6',
              }}
            >
              <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-gray-700 shadow-xs">
                {getCategoryIcon(item.category)}
              </div>
            </div>
          )}

          {/* Color pill in bottom-right */}
          <div
            className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs"
            style={{ backgroundColor: item.color || '#CBD5E1' }}
            title={item.colorName || 'Color'}
          />
        </div>

        {/* Text info */}
        <div className="mt-2 text-left">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            {roleLabel}
          </p>
          <p
            className="text-xs font-semibold text-gray-900 truncate mt-0.5"
            title={item.name}
          >
            {item.name}
          </p>
          <p className="text-[11px] text-gray-500 truncate capitalize">
            {item.subcategory || item.colorName || item.category}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* 1. Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-100 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Wardrobe Stylist</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            What should I wear?
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-500">
            Pick an occasion and we&apos;ll find the perfect outfit from your wardrobe.
          </p>
        </div>

        {/* 2 & 3. Selectors Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-10">
          {/* Occasion Selector */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3.5">
              <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                1. Select Occasion <span className="text-brand-600">*</span>
              </label>
              {selectedOccasion && (
                <span className="text-xs font-medium text-brand-600">
                  Selected:{' '}
                  {OCCASIONS.find((o) => o.value === selectedOccasion)?.label}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {OCCASIONS.map((occ) => {
                const isSelected = selectedOccasion === occ.value;
                return (
                  <button
                    key={occ.value}
                    type="button"
                    onClick={() => setSelectedOccasion(occ.value)}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50/70 text-brand-800 shadow-sm ring-2 ring-brand-500/20'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="text-2xl mb-1.5 transform transition-transform group-hover:scale-110">
                      {occ.emoji}
                    </span>
                    <span className="text-xs font-semibold leading-snug">
                      {occ.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Season Selector */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
              2. Select Season
            </label>
            <div className="flex flex-wrap gap-2.5">
              {SEASONS.map((season) => {
                const isSelected = selectedSeason === season.value;
                return (
                  <button
                    key={season.value}
                    type="button"
                    onClick={() => setSelectedSeason(season.value)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    <span>{season.emoji}</span>
                    <span>{season.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center sm:text-left">
              {clothes.length === 0 ? (
                <span className="text-amber-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Your wardrobe is empty. Add clothes in the Wardrobe tab first!
                </span>
              ) : (
                `Matching against ${clothes.length} items in your closet`
              )}
            </p>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={!selectedOccasion || isGenerating}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-white transition-all shadow-sm ${
                !selectedOccasion || isGenerating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-brand-600 hover:bg-brand-700 hover:shadow-md active:scale-95'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Styling Your Look...' : 'Find My Outfit ✨'}</span>
            </button>
          </div>
        </div>

        {/* 6. Loading state (Fun Shimmer Animation) */}
        {isGenerating && (
          <div className="py-16 text-center space-y-4">
            <div className="inline-flex p-4 rounded-3xl bg-brand-50 text-brand-600 animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 animate-pulse">
              Curating your best look...
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Analyzing color harmony, seasonality, and occasion rules from your wardrobe.
            </p>

            {/* Shimmer skeleton cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-4xl mx-auto">
              {[1, 2].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm animate-pulse space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded-full w-24" />
                    <div className="h-6 bg-brand-100 rounded-full w-20" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-32 bg-gray-100 rounded-xl" />
                    <div className="h-32 bg-gray-100 rounded-xl" />
                    <div className="h-32 bg-gray-100 rounded-xl" />
                  </div>
                  <div className="h-10 bg-gray-100 rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Results Section */}
        {!isGenerating && hasGenerated && (
          <section id="results-section" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Suggested Outfits
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tailored for{' '}
                  <span className="font-semibold text-gray-700 capitalize">
                    {selectedOccasion}
                  </span>{' '}
                  •{' '}
                  <span className="font-semibold text-gray-700 capitalize">
                    {selectedSeason}
                  </span>
                </p>
              </div>

              {outfits.length > 0 && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-100">
                  {outfits.length} options found
                </span>
              )}
            </div>

            {/* Empty State */}
            {outfits.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm text-center max-w-xl mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                  <Layers className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  No matching outfits found
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-6">
                  Try a different occasion, select &apos;All Seasons&apos;, or add more tops and bottoms to your wardrobe!
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSeason('all');
                      handleGenerate();
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 transition-colors"
                  >
                    Try All Seasons
                  </button>
                  <Link
                    href="/wardrobe"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add More Clothes</span>
                  </Link>
                </div>
              </div>
            ) : (
              /* Outfits Grid */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {outfits.map((outfit, index) => {
                  const isWorn = wornOutfits[outfit.id];

                  return (
                    <div
                      key={outfit.id}
                      className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Top Meta: Option Index & Score Badge */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">
                            Look #{index + 1}
                          </span>
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-brand-50 text-brand-700 border border-brand-100">
                            <Sparkles className="w-3 h-3 text-brand-500" />
                            {outfit.score}% match
                          </span>
                        </div>

                        {/* Visual Pieces Layout */}
                        {outfit.ethnic ? (
                          /* Ethnic / Traditional Outfit Layout */
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <OutfitItemPiece
                              item={outfit.ethnic}
                              roleLabel="Ethnic Outfit"
                            />
                            <OutfitItemPiece
                              item={outfit.shoes}
                              roleLabel="Footwear"
                            />
                          </div>
                        ) : (
                          /* Standard Western Layout: Top, Bottom, Shoes */
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            <OutfitItemPiece
                              item={outfit.top}
                              roleLabel="Top"
                            />
                            <OutfitItemPiece
                              item={outfit.bottom}
                              roleLabel="Bottom"
                            />
                            <OutfitItemPiece
                              item={outfit.shoes}
                              roleLabel="Shoes"
                            />
                          </div>
                        )}

                        {/* Outerwear & Accessories row if present */}
                        {(outfit.outerwear ||
                          (outfit.accessories && outfit.accessories.length > 0)) && (
                          <div className="pt-3 pb-3 border-t border-gray-100 flex flex-wrap items-center gap-2 mb-3">
                            <span className="text-[11px] font-semibold text-gray-400 mr-1">
                              Accents:
                            </span>

                            {outfit.outerwear && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-50 border border-gray-200 text-gray-700">
                                <CloudSnow className="w-3.5 h-3.5 text-cyan-600" />
                                <span className="truncate max-w-[120px]">
                                  {outfit.outerwear.name}
                                </span>
                              </span>
                            )}

                            {outfit.accessories &&
                              outfit.accessories.map((acc) => (
                                <span
                                  key={acc.id}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-50 border border-gray-200 text-gray-700"
                                >
                                  <Watch className="w-3.5 h-3.5 text-amber-600" />
                                  <span className="truncate max-w-[120px]">
                                    {acc.name}
                                  </span>
                                </span>
                              ))}
                          </div>
                        )}

                        {/* Reason / Stylist Note */}
                        <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100 mb-5">
                          <p className="text-xs text-gray-600 leading-relaxed">
                            💡 <span className="font-semibold text-gray-800">Stylist note:</span> {outfit.reason}
                          </p>
                        </div>
                      </div>

                      {/* Wear This Action */}
                      <button
                        type="button"
                        onClick={() => handleWearOutfit(outfit.id, outfit)}
                        disabled={isWorn}
                        className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                          isWorn
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                            : 'bg-brand-600 hover:bg-brand-700 text-white shadow-xs active:scale-[0.99]'
                        }`}
                      >
                        {isWorn ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Worn Today! (Logged)</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Wear This Outfit</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
