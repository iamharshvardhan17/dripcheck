'use client';

import { useState } from 'react';
import {
  Heart,
  Pencil,
  Trash2,
  Shirt,
  Footprints,
  Watch,
  CloudSnow,
  Sparkles,
  Layers,
  Check,
  X,
} from 'lucide-react';

const CATEGORY_ICON_MAP = {
  tops: Shirt,
  bottoms: Layers,
  shoes: Footprints,
  accessories: Watch,
  outerwear: CloudSnow,
  ethnic: Sparkles,
};

export default function ClothCard({ cloth, onEdit, onDelete, onFavorite, onWear }) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const CategoryIcon = CATEGORY_ICON_MAP[cloth.category] || Shirt;

  const handleDelete = () => {
    if (onDelete) {
      onDelete(cloth.id);
    }
    setShowConfirmDelete(false);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden">
      {/* Top Media / Placeholder Section */}
      <div className="relative w-full aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
        {cloth.imageUrl ? (
          <img
            src={cloth.imageUrl}
            alt={cloth.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center shadow-sm border border-black/10 transition-transform group-hover:scale-105"
            style={{ backgroundColor: cloth.color || '#9333ea' }}
          >
            <CategoryIcon className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-md" />
          </div>
        )}

        {/* Favorite Floating Button */}
        <button
          type="button"
          onClick={() => onFavorite && onFavorite(cloth.id)}
          aria-label={cloth.favorite ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white hover:scale-110 active:scale-95 transition-all text-gray-400"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              cloth.favorite
                ? 'fill-rose-500 text-rose-500'
                : 'hover:text-rose-500'
            }`}
          />
        </button>

        {/* Color Dot & Category Pill */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm text-xs font-medium text-gray-700">
          <span
            className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0 shadow-xs"
            style={{ backgroundColor: cloth.color }}
            title={cloth.colorName || cloth.color}
          />
          <span className="capitalize">{cloth.subcategory || cloth.category}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Item Name */}
          <h3
            className="font-semibold text-gray-900 text-sm sm:text-base truncate capitalize"
            title={cloth.name}
          >
            {cloth.name}
          </h3>

          {/* Occasion & Season Pills */}
          <div className="mt-2 flex flex-wrap gap-1">
            {Array.isArray(cloth.occasions) &&
              cloth.occasions.slice(0, 2).map((occ) => (
                <span
                  key={occ}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-brand-50 text-brand-700 border border-brand-100 capitalize"
                >
                  {occ}
                </span>
              ))}
            {Array.isArray(cloth.occasions) && cloth.occasions.length > 2 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600">
                +{cloth.occasions.length - 2}
              </span>
            )}
            {Array.isArray(cloth.seasons) &&
              cloth.seasons.map((season) => (
                <span
                  key={season}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-50 text-gray-600 border border-gray-200 capitalize"
                >
                  {season}
                </span>
              ))}
          </div>
        </div>

        {/* Actions Bottom Row */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-gray-500 text-xs">
          {/* Times Worn Badge (Clickable to log wear) */}
          <button
            type="button"
            onClick={() => onWear && onWear(cloth.id)}
            title="Click to wear today (+1 count)"
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-brand-50 hover:text-brand-700 text-gray-600 transition-colors"
          >
            <Shirt className="w-3.5 h-3.5 text-brand-600" />
            <span className="font-semibold text-gray-800">{cloth.timesWorn || 0}</span>
            <span className="hidden sm:inline text-gray-400">worn</span>
          </button>

          {/* Edit & Delete Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit && onEdit(cloth)}
              title="Edit item"
              className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setShowConfirmDelete(true)}
              title="Delete item"
              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Overlay */}
      {showConfirmDelete && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-150">
          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
            <Trash2 className="w-5 h-5" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">
            Delete this item?
          </p>
          <p className="text-[11px] text-gray-500 mb-4 px-2">
            This action cannot be undone.
          </p>
          <div className="flex items-center gap-2 w-full justify-center">
            <button
              type="button"
              onClick={() => setShowConfirmDelete(false)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-medium hover:bg-rose-700 transition-colors shadow-sm"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
