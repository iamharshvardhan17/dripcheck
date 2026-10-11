'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { getClothes, getStats } from '@/lib/store';
import { CATEGORIES } from '@/lib/constants';
import {
  Shirt,
  Heart,
  TrendingUp,
  Grid3x3,
  Plus,
  Sparkles,
  LayoutGrid,
  ArrowRight,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [clothes, setClothes] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    byCategory: {
      tops: 0,
      bottoms: 0,
      shoes: 0,
      accessories: 0,
      outerwear: 0,
      ethnic: 0,
    },
    favorites: 0,
    recentlyAdded: [],
  });

  useEffect(() => {
    setMounted(true);
    const loadedClothes = getClothes();
    const loadedStats = getStats();
    setClothes(loadedClothes);
    setStats(loadedStats);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning! 👋';
    if (hour < 18) return 'Good afternoon! 👋';
    return 'Good evening! 👋';
  };

  const mostWornItem = clothes.reduce((prevMax, current) => {
    if ((current.timesWorn || 0) > (prevMax?.timesWorn || 0)) {
      return current;
    }
    return prevMax;
  }, null);

  const mostWornDisplay =
    mostWornItem && mostWornItem.timesWorn > 0
      ? mostWornItem.name
      : '—';

  const activeCategoriesCount = Object.values(stats.byCategory || {}).filter(
    (count) => count > 0
  ).length;

  const categoryBarColors = {
    tops: 'bg-brand-500',
    bottoms: 'bg-blue-500',
    shoes: 'bg-emerald-500',
    accessories: 'bg-amber-500',
    outerwear: 'bg-cyan-500',
    ethnic: 'bg-rose-500',
  };

  const categoryBadgeColors = {
    tops: 'bg-brand-50 text-brand-700',
    bottoms: 'bg-blue-50 text-blue-700',
    shoes: 'bg-emerald-50 text-emerald-700',
    accessories: 'bg-amber-50 text-amber-700',
    outerwear: 'bg-cyan-50 text-cyan-700',
    ethnic: 'bg-rose-50 text-rose-700',
  };

  const maxCategoryCount = Math.max(
    1,
    ...Object.values(stats.byCategory || {})
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* 1. Welcome Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              {getGreeting()}
            </h1>
            <p className="mt-1 text-sm sm:text-base text-gray-500">
              Here&apos;s your wardrobe at a glance.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700 border border-brand-100">
              <Calendar className="w-3.5 h-3.5" />
              {mounted
                ? new Date().toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Today'}
            </span>
          </div>
        </div>

        {/* 2. Stats Cards Row */}
        <section aria-label="Wardrobe Statistics" className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Items */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white flex items-center justify-center shadow-sm">
                <Shirt className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Total Items
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                    {stats.total}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">pieces</span>
                </div>
              </div>
            </div>

            {/* Favorites */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Favorites
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                    {stats.favorites}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">starred</span>
                </div>
              </div>
            </div>

            {/* Most Worn */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Most Worn
                </p>
                <p
                  className="text-lg font-bold text-gray-900 truncate"
                  title={mostWornDisplay}
                >
                  {mostWornDisplay}
                </p>
                {mostWornItem && mostWornItem.timesWorn > 0 && (
                  <p className="text-xs text-amber-600 font-medium">
                    {mostWornItem.timesWorn} times worn
                  </p>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Grid3x3 className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Categories
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                    {activeCategoriesCount}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    / {CATEGORIES.length} active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Quick Actions Row */}
        <section aria-label="Quick Actions" className="mb-10">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/wardrobe"
              className="group relative bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-brand-300 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center group-hover:scale-105 group-hover:bg-brand-100 transition-all">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-brand-700 transition-colors">
                    Add New Item
                  </h3>
                  <p className="text-xs text-gray-500">
                    Upload clothes with tags & color
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/outfit"
              className="group relative bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-5 text-white shadow-sm hover:shadow-md hover:to-brand-800 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm text-white flex items-center justify-center group-hover:scale-105 transition-all">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Get Outfit Idea</h3>
                  <p className="text-xs text-brand-100">
                    Smart AI stylist matching
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/wardrobe"
              className="group relative bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-brand-300 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center group-hover:scale-105 group-hover:bg-gray-200 transition-all">
                  <LayoutGrid className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-brand-700 transition-colors">
                    View Wardrobe
                  </h3>
                  <p className="text-xs text-gray-500">
                    Filter, sort, and manage all pieces
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
        </section>

        {/* 3 & 5. Recently Added & Category Breakdown Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 3. Recently Added (7 cols) */}
          <section className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Recently Added
                  </h2>
                  <p className="text-xs text-gray-500">
                    Your newest additions to the closet
                  </p>
                </div>
                <Link
                  href="/wardrobe"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                >
                  <span>See all</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {stats.recentlyAdded && stats.recentlyAdded.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentlyAdded.map((item) => {
                    const formattedDate = item.dateAdded
                      ? new Date(item.dateAdded).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'Recently';

                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:border-gray-200 hover:bg-gray-50/60 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Thumbnail / Color swatch */}
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-12 h-12 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                            />
                          ) : (
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-200 shadow-inner"
                              style={{
                                backgroundColor: item.color || '#E5E7EB',
                              }}
                            >
                              <span
                                className="w-4 h-4 rounded-full border border-black/10 shadow-sm"
                                style={{
                                  backgroundColor: item.color || '#9CA3AF',
                                }}
                              />
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-gray-900 truncate">
                              {item.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span
                                className={`text-[11px] font-medium px-2 py-0.5 rounded-md capitalize ${
                                  categoryBadgeColors[item.category] ||
                                  'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {item.category}
                              </span>
                              <span className="text-[11px] text-gray-400">
                                {item.colorName || 'Color'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0 pl-3">
                          <span className="text-xs text-gray-400 font-medium">
                            {formattedDate}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 px-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
                  <Layers className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm font-medium text-gray-700">
                    No items in wardrobe yet
                  </p>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                    Start cataloging your closet to receive outfit suggestions and keep track of wears.
                  </p>
                  <Link
                    href="/wardrobe"
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add your first piece</span>
                  </Link>
                </div>
              )}
            </div>

            {stats.recentlyAdded && stats.recentlyAdded.length > 0 && (
              <div className="pt-4 border-t border-gray-100 mt-4">
                <Link
                  href="/wardrobe"
                  className="w-full py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <span>Manage All {stats.total} Items</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </section>

          {/* 5. Category Breakdown (5 cols) */}
          <section className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="mb-5">
                <h2 className="text-lg font-bold text-gray-900">
                  Category Breakdown
                </h2>
                <p className="text-xs text-gray-500">
                  Distribution of clothes across categories
                </p>
              </div>

              <div className="space-y-4">
                {CATEGORIES.map((cat) => {
                  const count = stats.byCategory?.[cat.value] || 0;
                  const percentage =
                    stats.total > 0
                      ? Math.round((count / stats.total) * 100)
                      : 0;
                  const barWidth =
                    maxCategoryCount > 0
                      ? Math.max(count > 0 ? 8 : 0, Math.round((count / maxCategoryCount) * 100))
                      : 0;

                  return (
                    <div key={cat.value} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-gray-700 flex items-center gap-1.5">
                          <span>{cat.label}</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {count}
                          </span>
                          <span className="text-gray-400 text-[11px] w-8 text-right">
                            ({percentage}%)
                          </span>
                        </div>
                      </div>

                      {/* Bar indicator */}
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            categoryBarColors[cat.value] || 'bg-brand-500'
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Total cataloged</span>
              <span className="font-bold text-gray-900 text-sm">
                {stats.total} items
              </span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
