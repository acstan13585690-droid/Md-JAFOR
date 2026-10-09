import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Download, 
  ShieldCheck, 
  ArrowRight, 
  Star, 
  Gamepad2, 
  Smartphone, 
  Cpu, 
  CheckCircle2, 
  Grid,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  Wrench,
  MessageCircle,
  Clock,
  Layers
} from 'lucide-react';
import type { ApkApp, AppCategory } from '../types/index.ts';
import { AppCard } from '../components/AppCard.tsx';
import { SecurityBadge } from '../components/SecurityBadge.tsx';

interface HomePageProps {
  apps: ApkApp[];
  onSelectApp: (app: ApkApp) => void;
  onDownloadApp: (app: ApkApp) => void;
  onNavigate: (view: string, params?: any) => void;
  onOpenFirebaseGuide: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  apps,
  onSelectApp,
  onDownloadApp,
  onNavigate,
  onOpenFirebaseGuide,
}) => {
  // Filter approved apps for public display
  const approvedApps = apps.filter((a) => a.status === 'APPROVED');
  const heroApp = approvedApps.find((a) => a.isHomepageHero) || approvedApps[0];
  const topApps = approvedApps.slice(0, 5);
  const gamesApps = approvedApps.filter((a) => a.category === 'Games');
  const trendingApps = [...approvedApps].sort((a, b) => b.downloadCount - a.downloadCount).slice(0, 4);
  const recentlyAdded = [...approvedApps].reverse().slice(0, 4);
  const featuredApps = approvedApps.filter((a) => a.isFeatured);

  return (
    <div className="space-y-7 pb-20 pt-1">
      
      {/* 1. LARGE PROMOTIONAL HERO BANNER (Clean Green & White Theme with Attractive Artwork) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white border border-emerald-100 shadow-[0_4px_20px_rgba(0,135,90,0.06)] p-5 sm:p-7 md:p-8">
        
        {/* Soft background glow & shapes */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-emerald-200/30 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-teal-200/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Banner Text & Action */}
          <div className="md:col-span-7 space-y-3.5 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-emerald-200/80 text-[#00875a] text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#00875a]" />
              <span>Official 100% Free APK Repository</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0f172a] leading-tight tracking-tight">
              Download Your Favorite <br className="hidden sm:inline" />
              <span className="text-[#00875a]">Android Apps</span> For Free
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md">
              Discover millions of tested, ad-free APK files. Instant direct download with SHA-256 signature verification and no registration required.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('categories')}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#00875a] hover:bg-[#00744e] text-white font-extrabold text-xs sm:text-sm rounded-full shadow-md shadow-[#00875a]/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Explore Now</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5px]" />
              </button>

              <button
                onClick={() => onNavigate('games')}
                className="flex items-center justify-center gap-1.5 px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 font-bold text-xs sm:text-sm rounded-full shadow-2xs transition-all cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4 text-amber-500" />
                <span>Browse Games</span>
              </button>
            </div>
          </div>

          {/* Banner Artwork (Showcasing Android App Cards & Badges) */}
          <div className="md:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] py-2">
              
              {/* Central Floating Feature Card */}
              {heroApp && (
                <div 
                  onClick={() => onSelectApp(heroApp)}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl border border-emerald-100 p-4 shadow-lg shadow-emerald-600/10 hover:shadow-xl transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Top Spotlight
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      v{heroApp.version}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img 
                      src={heroApp.iconUrl} 
                      alt={heroApp.name} 
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-xs"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {heroApp.name}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">
                        By {heroApp.developerName}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold mt-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{heroApp.rating}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500 text-[11px]">{heroApp.apkSizeMb} MB</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownloadApp(heroApp);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#00875a] hover:bg-[#00744e] text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 stroke-[2.5px]" />
                    <span>Download APK Free</span>
                  </button>
                </div>
              )}

              {/* Verified Trust Tag Below Hero */}
              <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500 bg-white/70 py-1 px-3 rounded-full border border-slate-200/60 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00875a]" />
                <span>SHA-256 Checksum Verified Clean</span>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* 2. FOUR COLORFUL CATEGORY SHORTCUTS (Apps, Games, Tools, Social) */}
      <section>
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
          
          {/* 1. Apps Shortcut (Blue) */}
          <button
            onClick={() => onNavigate('categories')}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white hover:bg-blue-50/70 border border-slate-200/90 hover:border-blue-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all group active:scale-95 cursor-pointer"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform mb-2">
              <Grid className="w-6 h-6 stroke-[2.2px]" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600">
              Apps
            </span>
          </button>

          {/* 2. Games Shortcut (Orange/Amber) */}
          <button
            onClick={() => onNavigate('games')}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white hover:bg-amber-50/70 border border-slate-200/90 hover:border-amber-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all group active:scale-95 cursor-pointer"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform mb-2">
              <Gamepad2 className="w-6 h-6 stroke-[2.2px]" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-amber-600">
              Games
            </span>
          </button>

          {/* 3. Tools Shortcut (Emerald/Green) */}
          <button
            onClick={() => onNavigate('browse', { category: 'Tools' })}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white hover:bg-emerald-50/70 border border-slate-200/90 hover:border-emerald-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all group active:scale-95 cursor-pointer"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#00875a] flex items-center justify-center text-white shadow-md shadow-[#00875a]/20 group-hover:scale-105 transition-transform mb-2">
              <Wrench className="w-6 h-6 stroke-[2.2px]" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#00875a]">
              Tools
            </span>
          </button>

          {/* 4. Social Shortcut (Purple/Violet) */}
          <button
            onClick={() => onNavigate('browse', { category: 'Social' })}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white hover:bg-purple-50/70 border border-slate-200/90 hover:border-purple-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all group active:scale-95 cursor-pointer"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-600/20 group-hover:scale-105 transition-transform mb-2">
              <MessageCircle className="w-6 h-6 stroke-[2.2px]" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-purple-600">
              Social
            </span>
          </button>

        </div>
      </section>


      {/* 3. TOP APPS (Horizontal cards with app icons, names, categories, and ratings) */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Top Apps
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-[#00875a] border border-emerald-200">
              Popular
            </span>
          </div>

          <button
            onClick={() => onNavigate('categories')}
            className="text-xs sm:text-sm font-bold text-[#00875a] hover:text-[#00744e] flex items-center gap-0.5 group cursor-pointer"
          >
            <span>See All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Horizontal App Cards List */}
        <div className="space-y-2.5">
          {topApps.map((app) => (
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


      {/* 4. TOP GAMES (Game artwork, names, ratings, and green download buttons) */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Top Games
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              High FPS
            </span>
          </div>

          <button
            onClick={() => onNavigate('games')}
            className="text-xs sm:text-sm font-bold text-[#00875a] hover:text-[#00744e] flex items-center gap-0.5 group cursor-pointer"
          >
            <span>See All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Games Visual Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {(gamesApps.length > 0 ? gamesApps.slice(0, 4) : approvedApps.slice(0, 4)).map((app) => (
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


      {/* 5. TRENDING APPS (Clean Responsive Grid) */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Trending Apps
            </h2>
          </div>

          <button
            onClick={() => onNavigate('browse', { sort: 'popular' })}
            className="text-xs sm:text-sm font-bold text-[#00875a] hover:text-[#00744e] flex items-center gap-0.5 group cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {trendingApps.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              variant="compact"
              onSelect={onSelectApp}
              onDownloadClick={onDownloadApp}
            />
          ))}
        </div>
      </section>


      {/* 6. RECENTLY ADDED (Fresh Verified Android Releases) */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Recently Added
            </h2>
          </div>

          <button
            onClick={() => onNavigate('browse', { sort: 'newest' })}
            className="text-xs sm:text-sm font-bold text-[#00875a] hover:text-[#00744e] flex items-center gap-0.5 group cursor-pointer"
          >
            <span>Latest APKs</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {recentlyAdded.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              variant="compact"
              onSelect={onSelectApp}
              onDownloadClick={onDownloadApp}
            />
          ))}
        </div>
      </section>


      {/* 7. FEATURED APPS (Editor's Picks) */}
      {featuredApps.length > 0 && (
        <section className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#00875a]" />
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Featured Apps
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredApps.slice(0, 3).map((app) => (
              <AppCard
                key={app.id}
                app={app}
                variant="featured"
                onSelect={onSelectApp}
                onDownloadClick={onDownloadApp}
              />
            ))}
          </div>
        </section>
      )}


      {/* 8. SECURITY & VERIFICATION BANNER */}
      <section className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#00875a]">
            <ShieldCheck className="w-6 h-6 stroke-[2.2px]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Safe & Malware-Free Downloads
            </h3>
            <p className="text-xs text-slate-500">
              Every APK is validated with SHA-256 signatures, permission audits, and Gemini AI heuristics.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 text-slate-700 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00875a]" />
            <span>0 Threats Detected</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 text-slate-700 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00875a]" />
            <span>Direct APK Files</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 text-slate-700 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00875a]" />
            <span>No Store Wrapper</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 text-slate-700 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00875a]" />
            <span>100% Free Access</span>
          </div>
        </div>
      </section>

    </div>
  );
};
