import React, { useState } from 'react';
import { 
  Gamepad2, 
  Sparkles, 
  Flame, 
  Star, 
  Download, 
  Trophy, 
  Zap, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sword,
  Target
} from 'lucide-react';
import type { ApkApp } from '../types/index.ts';
import { AppCard } from '../components/AppCard.tsx';

interface GamesPageProps {
  apps: ApkApp[];
  onSelectApp: (app: ApkApp) => void;
  onDownloadApp: (app: ApkApp) => void;
  onNavigate: (view: string, params?: any) => void;
}

const GAME_CHIPS = [
  'All Games',
  'Action & Combat',
  'RPG & Adventure',
  'Strategy',
  'Casual & Arcade',
  'Sports & Racing',
  'Simulation'
];

export const GamesPage: React.FC<GamesPageProps> = ({
  apps,
  onSelectApp,
  onDownloadApp,
  onNavigate,
}) => {
  const [activeChip, setActiveChip] = useState('All Games');

  const approvedGames = apps.filter((a) => a.category === 'Games' && a.status === 'APPROVED');
  // If there are other apps, fall back or filter
  const allGameLikeApps = approvedGames.length > 0 
    ? approvedGames 
    : apps.filter((a) => a.status === 'APPROVED');

  const featuredGame = allGameLikeApps[0];

  return (
    <div className="space-y-6 pb-20 pt-1">
      
      {/* 1. ATTRACTIVE GAME HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 text-white p-6 sm:p-8 shadow-lg shadow-orange-500/15">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-black/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 backdrop-blur-xs text-white text-xs font-bold border border-white/20">
            <Gamepad2 className="w-4 h-4 text-amber-300" />
            <span>High Performance Android Gaming</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Top Android Games Direct APKs
          </h1>

          <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
            Fastest downloads, offline play capabilities, high FPS unlocked, and 100% free of invasive wrappers.
          </p>

          {featuredGame && (
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => onSelectApp(featuredGame)}
                className="px-5 py-2.5 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>Featured: {featuredGame.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 2. CATEGORY CHIPS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {GAME_CHIPS.map((chip) => {
          const isSelected = activeChip === chip;
          return (
            <button
              key={chip}
              onClick={() => setActiveChip(chip)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#00875a] text-white shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90'
              }`}
            >
              {chip}
            </button>
          );
        })}
      </div>

      {/* 3. VISUAL GAME SHOWCASE CARDS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Featured Game Releases</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {allGameLikeApps.length} Titles
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {allGameLikeApps.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              variant="game-card"
              onSelect={onSelectApp}
              onDownloadClick={onDownloadApp}
            />
          ))}
        </div>
      </section>

      {/* 4. APP ROWS WITH GREEN DOWNLOAD BUTTONS */}
      <section className="space-y-3 pt-3">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#00875a]" />
          <span>All Games List</span>
        </h2>

        <div className="space-y-2.5">
          {allGameLikeApps.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              variant="horizontal"
              onSelect={onSelectApp}
              onDownloadClick={onDownloadApp}
            />
          ))}
        </div>
      </section>

    </div>
  );
};
