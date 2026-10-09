import React, { useState } from 'react';
import { 
  Grid, 
  Gamepad2, 
  Wrench, 
  MessageCircle, 
  Camera, 
  Music, 
  ShieldCheck, 
  TrendingUp, 
  Briefcase, 
  Smartphone, 
  Layers,
  ChevronRight,
  Download,
  Star,
  CheckCircle2
} from 'lucide-react';
import type { ApkApp, AppCategory } from '../types/index.ts';
import { AppCard } from '../components/AppCard.tsx';

interface CategoriesPageProps {
  apps: ApkApp[];
  onSelectApp: (app: ApkApp) => void;
  onDownloadApp: (app: ApkApp) => void;
  onNavigate: (view: string, params?: any) => void;
}

interface CategoryMeta {
  name: AppCategory;
  label: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

const CATEGORY_ITEMS: CategoryMeta[] = [
  {
    name: 'Games',
    label: 'Action, RPG & Casual',
    icon: Gamepad2,
    color: 'text-amber-600',
    bgColor: 'bg-amber-500',
    borderColor: 'border-amber-200',
    description: 'High performance 3D, casual, arcade and RPG games for Android.'
  },
  {
    name: 'Tools',
    label: 'Utilities & System Tools',
    icon: Wrench,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-500',
    borderColor: 'border-emerald-200',
    description: 'Storage cleaners, CPU monitors, VPNs and utility power tools.'
  },
  {
    name: 'Social',
    label: 'Communities & Feeds',
    icon: MessageCircle,
    color: 'text-purple-600',
    bgColor: 'bg-purple-600',
    borderColor: 'border-purple-200',
    description: 'Connect with communities, share media and chat securely.'
  },
  {
    name: 'Communication',
    label: 'Messaging & VoIP',
    icon: MessageCircle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500',
    borderColor: 'border-blue-200',
    description: 'Encrypted chat messengers, VoIP calls, and team communications.'
  },
  {
    name: 'Photography',
    label: 'Cameras & AI Editors',
    icon: Camera,
    color: 'text-rose-600',
    bgColor: 'bg-rose-500',
    borderColor: 'border-rose-200',
    description: 'RAW photo capture, filters, AI retouching and video editors.'
  },
  {
    name: 'Media',
    label: 'Music, Video & Players',
    icon: Music,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-500',
    borderColor: 'border-indigo-200',
    description: 'Hi-res audio equalizers, offline players and streaming tools.'
  },
  {
    name: 'Productivity',
    label: 'Notes, Docs & Tasks',
    icon: Briefcase,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-500',
    borderColor: 'border-cyan-200',
    description: 'Work efficiently with task managers, calendars and office suites.'
  },
  {
    name: 'Personalization',
    label: 'Launchers & Customization',
    icon: Smartphone,
    color: 'text-fuchsia-600',
    bgColor: 'bg-fuchsia-500',
    borderColor: 'border-fuchsia-200',
    description: 'Custom launchers, themes, icon packs and live wallpapers.'
  },
  {
    name: 'Security',
    label: 'Privacy, VPNs & Antivirus',
    icon: ShieldCheck,
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-600',
    borderColor: 'border-emerald-200',
    description: 'Keep your device protected with VPN tunnels and security suites.'
  },
  {
    name: 'Finance',
    label: 'Crypto, Budgeting & Wealth',
    icon: TrendingUp,
    color: 'text-teal-600',
    bgColor: 'bg-teal-500',
    borderColor: 'border-teal-200',
    description: 'Crypto wallets, budget trackers and stock market portfolios.'
  },
];

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  apps,
  onSelectApp,
  onDownloadApp,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AppCategory | 'ALL'>('ALL');

  // Filter apps
  const approvedApps = apps.filter((a) => a.status === 'APPROVED');
  const filteredApps = selectedCategory === 'ALL'
    ? approvedApps
    : approvedApps.filter((a) => a.category === selectedCategory);

  return (
    <div className="space-y-6 pb-20 pt-1">
      
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00875a]">
          <Layers className="w-4 h-4" />
          <span>Application Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Browse Categories
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Find Android apps and games organized by department and software type
        </p>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'ALL'
              ? 'bg-[#00875a] text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90'
          }`}
        >
          All Categories ({approvedApps.length})
        </button>
        {CATEGORY_ITEMS.map((item) => {
          const count = approvedApps.filter((a) => a.category === item.name).length;
          const isSelected = selectedCategory === item.name;
          return (
            <button
              key={item.name}
              onClick={() => setSelectedCategory(item.name)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-[#00875a] text-white shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90'
              }`}
            >
              <span>{item.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Clean Vertical Category List (matching APKZone reference image) */}
      {selectedCategory === 'ALL' && (
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">
            All Software Categories
          </h2>

          <div className="space-y-2.5">
            {CATEGORY_ITEMS.map((cat) => {
              const Icon = cat.icon;
              const count = approvedApps.filter((a) => a.category === cat.name).length;
              return (
                <div
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-[#00875a]/50 shadow-2xs hover:shadow-sm transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-11 h-11 rounded-2xl ${cat.bgColor} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform flex-shrink-0`}>
                      <Icon className="w-5 h-5 stroke-[2.2px]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#00875a] transition-colors">
                          {cat.name}
                        </h3>
                        <span className="text-[11px] font-semibold text-slate-400">
                          ({count} apps)
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#00875a] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* App Cards for Selected Category */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            {selectedCategory === 'ALL' ? 'Featured In Categories' : `${selectedCategory} Applications`}
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredApps.length} packages
          </span>
        </div>

        {filteredApps.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/90 space-y-2">
            <p className="text-sm font-bold text-slate-700">No applications in this category yet</p>
            <p className="text-xs text-slate-400">Be the first developer to publish an APK in this category!</p>
            <button
              onClick={() => onNavigate('developer')}
              className="mt-3 px-4 py-2 rounded-full bg-[#00875a] text-white text-xs font-bold"
            >
              Publish APK Now
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
