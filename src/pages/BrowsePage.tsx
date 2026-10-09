import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Grid, Star, X, Filter } from 'lucide-react';
import type { ApkApp, AppCategory } from '../types/index.ts';
import { AppCard } from '../components/AppCard.tsx';

interface BrowsePageProps {
  apps: ApkApp[];
  initialCategory?: string;
  initialSearch?: string;
  initialSort?: string;
  onSelectApp: (app: ApkApp) => void;
  onDownloadApp: (app: ApkApp) => void;
}

const CATEGORIES = [
  'All',
  'Games',
  'Tools',
  'Personalization',
  'Security',
  'Photography',
  'Media',
  'Communication',
  'Finance',
];

export const BrowsePage: React.FC<BrowsePageProps> = ({
  apps,
  initialCategory = 'All',
  initialSearch = '',
  initialSort = 'popular',
  onSelectApp,
  onDownloadApp,
}) => {
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSort);
  const [minRating, setMinRating] = useState(0);

  // Filter approved apps only
  const filteredApps = useMemo(() => {
    let result = apps.filter((a) => a.status === 'APPROVED');

    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(
        (a) => a.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.packageName.toLowerCase().includes(q) ||
          a.developerName.toLowerCase().includes(q) ||
          a.shortDescription.toLowerCase().includes(q)
      );
    }

    if (minRating > 0) {
      result = result.filter((a) => a.rating >= minRating);
    }

    // Sort
    if (sortBy === 'popular') {
      result.sort((a, b) => b.downloadCount - a.downloadCount);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === 'size') {
      result.sort((a, b) => a.apkSizeMb - b.apkSizeMb);
    }

    return result;
  }, [apps, selectedCategory, search, sortBy, minRating]);

  return (
    <div className="space-y-6 pb-20 pt-1">
      
      {/* Header & Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 space-y-4 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Discover Verified Android Packages
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Browse through secure, static-analyzed APKs direct from publishers
          </p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by app name, package name, or keywords..."
            className="w-full pl-11 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00875a]"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-[#00875a] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Recently Added</option>
              <option value="size">Smallest APK Size</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Rating:</span>
            <div className="flex gap-1">
              {[0, 4, 4.5].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setMinRating(stars)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                    minRating === stars
                      ? 'bg-[#00875a] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {stars === 0 ? 'All' : `${stars}+ ★`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Results */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs text-slate-500 font-medium">
          <span>Showing {filteredApps.length} packages</span>
          {selectedCategory !== 'All' && (
            <span className="font-bold text-[#00875a]">Category: {selectedCategory}</span>
          )}
        </div>

        {filteredApps.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/90 space-y-3">
            <p className="text-sm font-bold text-slate-700">No applications matched your criteria</p>
            <p className="text-xs text-slate-400">Try loosening your search terms or filters.</p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
                setMinRating(0);
              }}
              className="px-4 py-2 bg-[#00875a] text-white text-xs font-bold rounded-full"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredApps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                variant="horizontal"
                onSelect={onSelectApp}
                onDownloadClick={onDownloadApp}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
