'use client';

import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  X,
  Upload,
  Heart,
  Camera,
  Trash2,
  Check,
  AlertCircle,
} from 'lucide-react';
import {
  CATEGORIES,
  SUBCATEGORIES,
  OCCASIONS,
  SEASONS,
  COLORS,
} from '@/lib/constants';

export default function AddClothModal({ isOpen, onClose, onSave, editItem }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('tops');
  const [subcategory, setSubcategory] = useState('');
  const [color, setColor] = useState(COLORS[0].hex);
  const [colorName, setColorName] = useState(COLORS[0].name);
  const [selectedOccasions, setSelectedOccasions] = useState(['casual']);
  const [selectedSeasons, setSelectedSeasons] = useState(['all']);
  const [imageUrl, setImageUrl] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState('');

  const fileInputRef = useRef(null);

  // Sync state when modal opens or editItem changes
  useEffect(() => {
    if (editItem) {
      setName(editItem.name || '');
      setCategory(editItem.category || 'tops');
      setSubcategory(editItem.subcategory || '');
      setColor(editItem.color || COLORS[0].hex);
      setColorName(editItem.colorName || COLORS[0].name);
      setSelectedOccasions(
        Array.isArray(editItem.occasions) && editItem.occasions.length > 0
          ? editItem.occasions
          : ['casual']
      );
      setSelectedSeasons(
        Array.isArray(editItem.seasons) && editItem.seasons.length > 0
          ? editItem.seasons
          : ['all']
      );
      setImageUrl(editItem.imageUrl || '');
      setFavorite(Boolean(editItem.favorite));
    } else {
      setName('');
      setCategory('tops');
      const defaultSubs = SUBCATEGORIES['tops'] || [];
      setSubcategory(defaultSubs[0] || '');
      setColor(COLORS[0].hex);
      setColorName(COLORS[0].name);
      setSelectedOccasions(['casual']);
      setSelectedSeasons(['all']);
      setImageUrl('');
      setFavorite(false);
    }
    setErrors({});
    setImageError('');
  }, [editItem, isOpen]);

  // Adjust subcategory when category changes
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    const available = SUBCATEGORIES[newCategory] || [];
    setSubcategory(available[0] || '');
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: undefined }));
    }
  };

  // Toggle multi-select chips
  const toggleOccasion = (value) => {
    setSelectedOccasions((prev) => {
      const exists = prev.includes(value);
      if (exists) {
        return prev.filter((item) => item !== value);
      } else {
        return [...prev, value];
      }
    });
    if (errors.occasions) {
      setErrors((prev) => ({ ...prev, occasions: undefined }));
    }
  };

  const toggleSeason = (value) => {
    setSelectedSeasons((prev) => {
      const exists = prev.includes(value);
      if (exists) {
        return prev.filter((item) => item !== value);
      } else {
        return [...prev, value];
      }
    });
    if (errors.seasons) {
      setErrors((prev) => ({ ...prev, seasons: undefined }));
    }
  };

  // Color selection
  const handleSelectColor = (selectedHex, selectedLabel) => {
    setColor(selectedHex);
    setColorName(selectedLabel);
    if (errors.color) {
      setErrors((prev) => ({ ...prev, color: undefined }));
    }
  };

  // Image handling with compression to ensure < 500KB
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    setImageError('');
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Compress as JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);

        // Check size (base64 length in bytes is roughly length * 0.75)
        const approxSizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);
        if (approxSizeKb > 500) {
          // Extra compression if needed
          const fallbackDataUrl = canvas.toDataURL('image/jpeg', 0.6);
          setImageUrl(fallbackDataUrl);
        } else {
          setImageUrl(dataUrl);
        }
      };
      img.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    setImageError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Validation & Save
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Please provide an item name';
    }
    if (!category) {
      newErrors.category = 'Please choose a category';
    }
    if (!color) {
      newErrors.color = 'Please select a primary color';
    }
    if (selectedOccasions.length === 0) {
      newErrors.occasions = 'Select at least one occasion';
    }
    if (selectedSeasons.length === 0) {
      newErrors.seasons = 'Select at least one season';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const clothData = {
      id: editItem?.id || uuidv4(),
      name: name.trim(),
      category,
      subcategory: subcategory || (SUBCATEGORIES[category]?.[0] || ''),
      color,
      colorName,
      occasions: selectedOccasions,
      seasons: selectedSeasons,
      imageUrl,
      favorite,
      dateAdded: editItem?.dateAdded || new Date().toISOString(),
      timesWorn: editItem?.timesWorn || 0,
    };

    onSave(clothData);
    onClose();
  };

  if (!isOpen) return null;

  const currentSubcategories = SUBCATEGORIES[category] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl z-10 max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {editItem ? 'Edit Clothing Item' : 'Add New Item'}
            </h2>
            <p className="text-xs text-gray-500">
              {editItem ? 'Update details for this item' : 'Fill in the information to add to your wardrobe'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Item Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Item Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="e.g. Navy Oxford Cotton Shirt"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors ${
                errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-gray-200 focus:border-transparent'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Category & Subcategory Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 capitalize bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Subcategory
              </label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 capitalize bg-white"
              >
                {currentSubcategories.map((sub) => (
                  <option key={sub} value={sub.toLowerCase()}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Visual Color Picker Grid */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Color: <span className="text-brand-700 font-bold normal-case">{colorName}</span>
              </label>
              <span className="text-xs text-gray-400">Select one</span>
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-9 gap-2.5 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
              {COLORS.map((c) => {
                const isSelected = color.toLowerCase() === c.hex.toLowerCase();
                const isLight = ['#ffffff', '#fffdd0', '#f5f5dc', '#87ceeb'].includes(
                  c.hex.toLowerCase()
                );
                return (
                  <button
                    key={c.name}
                    type="button"
                    title={c.name}
                    onClick={() => handleSelectColor(c.hex, c.name)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'ring-2 ring-brand-600 ring-offset-2 scale-110 shadow-sm'
                        : 'hover:scale-105 border-black/10'
                    }`}
                  >
                    {isSelected && (
                      <Check
                        className={`w-4 h-4 ${
                          isLight ? 'text-gray-900' : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
            {errors.color && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.color}
              </p>
            )}
          </div>

          {/* Occasions Multi-Select */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Occasions <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-gray-400">Select multiple</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map((occ) => {
                const isSelected = selectedOccasions.includes(occ.value);
                return (
                  <button
                    key={occ.value}
                    type="button"
                    onClick={() => toggleOccasion(occ.value)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-brand-600 text-white shadow-sm ring-1 ring-brand-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{occ.emoji}</span>
                    <span>{occ.label}</span>
                  </button>
                );
              })}
            </div>
            {errors.occasions && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.occasions}
              </p>
            )}
          </div>

          {/* Seasons Multi-Select */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Seasons <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-gray-400">Select multiple</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SEASONS.map((season) => {
                const isSelected = selectedSeasons.includes(season.value);
                return (
                  <button
                    key={season.value}
                    type="button"
                    onClick={() => toggleSeason(season.value)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-brand-600 text-white shadow-sm ring-1 ring-brand-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{season.emoji}</span>
                    <span>{season.label}</span>
                  </button>
                );
              })}
            </div>
            {errors.seasons && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.seasons}
              </p>
            )}
          </div>

          {/* Image Upload / Preview */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Item Photo (Optional, max 500KB)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {imageUrl ? (
              <div className="relative w-full h-44 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt="Cloth preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 text-rose-600 hover:bg-white shadow-md transition-all hover:scale-105"
                  title="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl hover:border-brand-400 bg-gray-50/50 hover:bg-brand-50/30 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-brand-600 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-white shadow-xs flex items-center justify-center text-brand-600">
                  <Camera className="w-4 h-4" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-semibold text-brand-600 hover:underline">
                    Click to upload
                  </span>
                  <span className="text-xs text-gray-500"> or take a photo</span>
                  <p className="text-[11px] text-gray-400 mt-0.5">JPG, PNG, or WebP</p>
                </div>
              </button>
            )}

            {imageError && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {imageError}
              </p>
            )}
          </div>

          {/* Favorite Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2.5">
              <div
                className={`p-2 rounded-lg ${
                  favorite ? 'bg-rose-50 text-rose-600' : 'bg-gray-100 text-gray-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorite ? 'fill-rose-500' : ''}`} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900">Mark as Favorite</p>
                <p className="text-[11px] text-gray-500">
                  Prioritize this item when matching outfits
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={favorite}
              onClick={() => setFavorite((prev) => !prev)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                favorite ? 'bg-brand-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  favorite ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 shadow-sm hover:shadow transition-all"
            >
              {editItem ? 'Save Changes' : 'Add to Wardrobe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
