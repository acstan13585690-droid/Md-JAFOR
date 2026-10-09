import React, { useState, useMemo } from 'react';
import { Search, X, Sparkles, Star, Download, TrendingUp, SlidersHorizontal } from 'lucide-react';
import type { ApkApp, AppCategory } from '../types/index.ts';
import { AppCard } from '../components/AppCard.tsx';

interface SearchPageProps {
  apps: ApkApp[];
  initialQuery?: string;
  onSelectApp: (app: ApkApp) => void;
  onDownloadApp: (app: ApkApp) => void;
  onNavigate: (view: string, params?: any) => void;
}

const POPULAR_SEARCH_CHIPS = [
  'Nova VPN',
  'CyberStrike RPG',
  'PhotoPro AI',
  'PixelForge',
  'Signal Messenger',
  'Arcade',
  'CleanMaster',
  'Nova Launcher',
  'Crypto Wallet'
];

export const SearchPage: React.FC<SearchPageProps> = ({
  apps,
  initialQuery = '',
  onSelectApp,
  onDownloadApp,
  onNavigate,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'downloads'>('relevance');

  // Filter approved apps only
  const approvedApps = apps.filter((a) => a.status === 'APPROVED');

  const filteredApps = useMemo(() => {
    let result = [...approvedApps];

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.developerName.toLowerCase().includes(q) ||
          a.shortDescription.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter((a) => a.category === selectedCategory);
    }

    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'downloads') {
      result.sort((a, b) => b.downloadCount - a.downloadCount);
    }

    return result;
  }, [approvedApps, query, selectedCategory, sortBy]);

  return (
    <div className="space-y-6 pb-20 pt-1">
      
      {/* Search Input Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="relative flex items-center bg-[#f4f6fa] border border-slate-200/90 rounded-full px-4 py-2 focus-within:bg-white focus-within:border-[#00875a] focus-within:ring-2 focus-within:ring-[#00875a]/15 transition-all">
          <Search className="w-5 h-5 text-slate-400 mr-2.5 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type app name, package, or keywords..."
            className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => {}}
            className="px-4 py-1.5 rounded-full bg-[#00875a] hover:bg-[#00744e] text-white text-xs font-bold transition-all shadow-xs"
          >
            Search
          </button>
        </div>

        {/* Popular Search Chips */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-[#00875a]" />
            <span>Trending Searches:</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {POPULAR_SEARCH_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => setQuery(chip)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  query === chip
                    ? 'bg-[#00875a] text-white font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Sort bar */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-slate-600">
          {filteredApps.length} results found {query && `for "${query}"`}
        </span>

        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#00875a]"
          >
            <option value="relevance">Most Relevant</option>
            <option value="rating">Highest Rated</option>
            <option value="downloads">Most Downloaded</option>
          </select>
        </div>
      </div>

      {/* Results List */}
      {filteredApps.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-3xl border border-slate-200/90 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No matching apps found for "{query}"
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try checking for spelling errors, searching broader terms, or explore our curated categories.
          </p>
          <button
            onClick={() => setQuery('')}
            className="px-4 py-2 rounded-full bg-[#00875a] text-white text-xs font-bold"
          >
            Clear Search
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
  );
};
