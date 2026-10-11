'use client';

import { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import ClothCard from '@/components/ClothCard';
import AddClothModal from '@/components/AddClothModal';
import {
  getClothes,
  addCloth,
  updateCloth,
  deleteCloth,
  toggleFavorite,
  incrementWear,
} from '@/lib/store';
import { CATEGORIES } from '@/lib/constants';
import {
  Plus,
  Search,
  SlidersHorizontal,
  Shirt,
  Sparkles,
  ArrowUpDown,
  Filter,
} from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'most_worn', label: 'Most Worn' },
  { value: 'favorites', label: 'Favorites First' },
];

export default function WardrobePage() {
  const [clothes, setClothes] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Load clothes from store on mount
  useEffect(() => {
    const loaded = getClothes();
    setClothes(loaded);
    setIsLoaded(true);
  }, []);

  // Handlers for clothing mutations
  const handleSaveCloth = (clothData) => {
    let updated;
    if (editingItem) {
      updated = updateCloth(clothData.id, clothData);
    } else {
      updated = addCloth(clothData);
    }
    setClothes(updated);
    setEditingItem(null);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditCloth = (cloth) => {
    setEditingItem(cloth);
    setIsModalOpen(true);
  };

  const handleDeleteCloth = (id) => {
    const updated = deleteCloth(id);
    setClothes(updated);
  };

  const handleToggleFavorite = (id) => {
    const updated = toggleFavorite(id);
    setClothes(updated);
  };

  const handleWearCloth = (id) => {
    const updated = incrementWear(id);
    setClothes(updated);
  };

  // Filter & Sort calculation
  const filteredAndSortedClothes = useMemo(() => {
    let result = [...clothes];

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter(
        (item) => item.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search by Name or Subcategory
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name?.toLowerCase().includes(q) ||
          item.subcategory?.toLowerCase().includes(q) ||
          item.colorName?.toLowerCase().includes(q)
      );
    }

    // Sort items
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        const dateA = new Date(a.dateAdded || 0).getTime();
        const dateB = new Date(b.dateAdded || 0).getTime();
        return dateB - dateA;
      }
      if (sortBy === 'oldest') {
        const dateA = new Date(a.dateAdded || 0).getTime();
        const dateB = new Date(b.dateAdded || 0).getTime();
        return dateA - dateB;
      }
      if (sortBy === 'most_worn') {
        return (b.timesWorn || 0) - (a.timesWorn || 0);
      }
      if (sortBy === 'favorites') {
        if (a.favorite === b.favorite) {
          return new Date(b.dateAdded || 0).getTime() - new Date(a.dateAdded || 0).getTime();
        }
        return a.favorite ? -1 : 1;
      }
      return 0;
    });

    return result;
  }, [clothes, selectedCategory, searchQuery, sortBy]);

  // Category filters list with "All" option
  const categoryFilters = [
    { value: 'all', label: 'All Items' },
    ...CATEGORIES,
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col selection:bg-brand-100 selection:text-brand-900">
      {/* Top Navigation */}
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                My Wardrobe
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-800">
                {clothes.length} {clothes.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Catalog, organize, and track everything in your closet.
            </p>
          </div>

          {/* Desktop Add Button */}
          <div className="hidden sm:block">
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm hover:shadow transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {/* Filter & Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs mb-8 space-y-4">
          {/* Top row: Search and Sort dropdown */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, type, or color..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-48">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent cursor-pointer appearance-none"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Bottom row: Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
            {categoryFilters.map((cat) => {
              const isActive = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Clothing Items Grid / Empty State */}
        {!isLoaded ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-gray-100 aspect-square flex flex-col justify-between p-4"
              >
                <div className="w-full h-3/4 bg-gray-100 rounded-xl" />
                <div className="h-4 bg-gray-100 rounded w-2/3 mt-2" />
              </div>
            ))}
          </div>
        ) : clothes.length === 0 ? (
          /* Empty Wardrobe State */
          <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 text-center max-w-lg mx-auto my-12 shadow-xs">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-brand-50 flex items-center justify-center text-brand-600 mb-5 shadow-inner">
              <Shirt className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Your wardrobe is empty!
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Add your first item to start curating your outfits, organizing colors, and styling your looks effortlessly.
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Item</span>
            </button>
          </div>
        ) : filteredAndSortedClothes.length === 0 ? (
          /* No Matches for Filter/Search */
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center max-w-md mx-auto my-8">
            <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              No matching items found
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Try adjusting your category filter or search keywords.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-brand-600 hover:bg-brand-50 border border-brand-200 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Responsive Cards Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredAndSortedClothes.map((cloth) => (
              <ClothCard
                key={cloth.id}
                cloth={cloth}
                onEdit={handleEditCloth}
                onDelete={handleDeleteCloth}
                onFavorite={handleToggleFavorite}
                onWear={handleWearCloth}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Add Item Button (Mobile / Always accessible) */}
      <div className="fixed bottom-6 right-6 z-40 sm:hidden">
        <button
          type="button"
          onClick={handleOpenAdd}
          aria-label="Add new clothing item"
          className="w-14 h-14 rounded-full bg-brand-600 text-white shadow-xl hover:bg-brand-700 active:scale-90 flex items-center justify-center transition-all"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {/* Slide-up Add/Edit Drawer Modal */}
      <AddClothModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveCloth}
        editItem={editingItem}
      />
    </div>
  );
}
