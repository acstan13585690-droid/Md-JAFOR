import React from 'react';
import { Download, Star, ShieldCheck, Sparkles, Flame, CheckCircle, ArrowRight } from 'lucide-react';
import type { ApkApp } from '../types/index.ts';
import { SecurityBadge } from './SecurityBadge.tsx';

interface AppCardProps {
  app: ApkApp;
  onSelect: (app: ApkApp) => void;
  onDownloadClick?: (app: ApkApp) => void;
  variant?: 'grid' | 'compact' | 'horizontal' | 'featured' | 'game-card';
  theme?: 'light' | 'dark';
}

export const AppCard: React.FC<AppCardProps> = ({ 
  app, 
  onSelect, 
  onDownloadClick,
  variant = 'grid',
  theme = 'light'
}) => {
  const formatDownloads = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K+`;
    return num.toString();
  };

  // 1. HORIZONTAL CARD (Top Apps / List Row matching reference image)
  if (variant === 'horizontal') {
    return (
      <div 
        onClick={() => onSelect(app)}
        className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-200/90 hover:border-[#00875a]/60 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 cursor-pointer"
      >
        <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-3">
          <img
            src={app.iconUrl}
            alt={app.name}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover border border-slate-100 shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#00875a] truncate transition-colors">
                {app.name}
              </h4>
              {app.isSponsored && (
                <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-amber-50 text-amber-700 border border-amber-200 flex-shrink-0">
                  Ad
                </span>
              )}
            </div>
            
            <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
              {app.category} • {app.apkSizeMb} MB
            </p>

            <div className="flex items-center gap-2 mt-1">
              <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {app.rating}
              </span>
              <span className="text-slate-300 text-xs">•</span>
              <span className="text-[11px] font-medium text-slate-500">
                {formatDownloads(app.downloadCount)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button: Green Download or Arrow */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownloadClick ? onDownloadClick(app) : onSelect(app);
          }}
          className="px-3.5 py-1.5 rounded-full bg-[#00875a] hover:bg-[#00744e] text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all flex items-center gap-1 flex-shrink-0 active:scale-95"
          title="Download APK"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5px]" />
          <span>GET</span>
        </button>
      </div>
    );
  }

  // 2. GAME CARD (With Visual Thumbnail / Artwork)
  if (variant === 'game-card') {
    const artworkUrl = app.screenshots && app.screenshots.length > 0 
      ? app.screenshots[0] 
      : app.iconUrl;

    return (
      <div 
        onClick={() => onSelect(app)}
        className="group flex flex-col rounded-2xl bg-white border border-slate-200/90 hover:border-[#00875a]/60 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
      >
        {/* Game Banner Thumbnail */}
        <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-slate-100">
          <img
            src={artworkUrl}
            alt={app.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          <span className="absolute bottom-2 left-2 text-[11px] font-bold text-white bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
            {app.category}
          </span>
          <span className="absolute bottom-2 right-2 flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-black/40 backdrop-blur-xs px-1.5 py-0.5 rounded-md">
            <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
            {app.rating}
          </span>
        </div>

        {/* Content */}
        <div className="p-3.5 flex flex-col justify-between flex-1 space-y-2.5">
          <div className="flex items-start gap-2.5">
            <img
              src={app.iconUrl}
              alt={app.name}
              className="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-xs flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#00875a] truncate">
                {app.name}
              </h4>
              <p className="text-[11px] text-slate-400 font-medium truncate">
                {app.developerName}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
            <span className="text-[11px] font-medium text-slate-500">
              {app.apkSizeMb} MB
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownloadClick ? onDownloadClick(app) : onSelect(app);
              }}
              className="px-3 py-1 rounded-full bg-[#00875a] hover:bg-[#00744e] text-white text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-all"
            >
              <Download className="w-3 h-3 stroke-[2.5px]" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. COMPACT CARD
  if (variant === 'compact') {
    return (
      <div 
        onClick={() => onSelect(app)}
        className="group flex items-center gap-3.5 p-3.5 rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-200/90 hover:border-[#00875a]/60 shadow-xs hover:shadow-md transition-all cursor-pointer"
      >
        <img
          src={app.iconUrl}
          alt={app.name}
          className="w-13 h-13 rounded-2xl object-cover border border-slate-100 shadow-xs group-hover:scale-105 transition-transform flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#00875a] truncate transition-colors">
              {app.name}
            </h4>
            {app.isSponsored && (
              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Ad
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 truncate mt-0.5 font-medium">
            {app.category} • {app.apkSizeMb} MB
          </p>
          <div className="flex items-center gap-2 mt-1 text-xs">
            <span className="flex items-center gap-0.5 text-amber-500 font-bold">
              ★ {app.rating}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 text-[11px]">
              {formatDownloads(app.downloadCount)}
            </span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownloadClick ? onDownloadClick(app) : onSelect(app);
          }}
          className="p-2.5 rounded-full bg-[#00875a]/10 hover:bg-[#00875a] text-[#00875a] hover:text-white transition-all flex-shrink-0"
          title="Download APK"
        >
          <Download className="w-4 h-4 stroke-[2.5px]" />
        </button>
      </div>
    );
  }

  // 4. FEATURED CARD
  if (variant === 'featured') {
    return (
      <div 
        onClick={() => onSelect(app)}
        className="group relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-white hover:bg-slate-50/50 border border-slate-200/90 hover:border-[#00875a]/60 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
      >
        <div>
          {/* Header badges */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs">
              <Flame className="w-3.5 h-3.5 text-emerald-600" /> Featured Pick
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {app.category}
            </span>
          </div>

          {/* App Info */}
          <div className="flex items-start gap-4 mb-4">
            <img
              src={app.iconUrl}
              alt={app.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-100 shadow-md group-hover:scale-105 transition-transform"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#00875a] truncate transition-colors">
                {app.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 truncate flex items-center gap-1 mt-0.5">
                {app.developerName}
                <CheckCircle className="w-3.5 h-3.5 text-[#00875a]" />
              </p>
              
              <div className="flex items-center gap-3 mt-2 text-xs sm:text-sm">
                <span className="flex items-center gap-1 font-bold text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {app.rating}
                  <span className="font-normal text-slate-400">
                    ({app.ratingCount.toLocaleString()})
                  </span>
                </span>
                <span className="text-slate-300">•</span>
                <span className="font-semibold text-slate-700">
                  {formatDownloads(app.downloadCount)} installs
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
            {app.shortDescription}
          </p>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
          <SecurityBadge security={app.security} size="sm" theme="light" />

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownloadClick ? onDownloadClick(app) : onSelect(app);
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-full bg-[#00875a] hover:bg-[#00744e] text-white shadow-md shadow-[#00875a]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-4 h-4 stroke-[2.5px]" />
            <span>Download ({app.apkSizeMb} MB)</span>
          </button>
        </div>
      </div>
    );
  }

  // 5. STANDARD GRID CARD
  return (
    <div 
      onClick={() => onSelect(app)}
      className="group relative flex flex-col justify-between rounded-3xl p-5 sm:p-6 bg-white hover:bg-slate-50/50 border border-slate-200/90 hover:border-[#00875a]/60 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      {/* Badges on card top */}
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          {app.category}
        </span>
        <div className="flex items-center gap-1.5">
          {app.isSponsored && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-700 border border-amber-200">
              PROMOTED
            </span>
          )}
          {app.isDemoData && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-500 border border-slate-200">
              Demo
            </span>
          )}
        </div>
      </div>

      {/* Main icon and metadata */}
      <div>
        <div className="flex items-start gap-3.5 mb-3.5">
          <img
            src={app.iconUrl}
            alt={app.name}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-slate-100 shadow-xs group-hover:scale-105 transition-transform"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-bold text-slate-900 group-hover:text-[#00875a] truncate transition-colors">
              {app.name}
            </h4>
            <p className="text-xs text-slate-500 truncate mt-0.5 font-medium">
              {app.developerName}
            </p>
            <div className="flex items-center gap-2 mt-1 text-xs">
              <span className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {app.rating}
              </span>
              <span className="text-slate-300">•</span>
              <span className="font-medium text-slate-500">
                {formatDownloads(app.downloadCount)}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {app.shortDescription}
        </p>
      </div>

      {/* Card footer */}
      <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
        <div className="text-xs font-mono font-medium text-slate-400">
          {app.apkSizeMb} MB • v{app.version}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownloadClick ? onDownloadClick(app) : onSelect(app);
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#00875a] hover:bg-[#00744e] text-white shadow-xs transition-all active:scale-95"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5px]" />
          <span>Get APK</span>
        </button>
      </div>
    </div>
  );
};
