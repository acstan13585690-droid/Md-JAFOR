import React, { useState } from 'react';
import { 
  User, 
  Download, 
  Heart, 
  Settings, 
  HelpCircle, 
  LogOut, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Bell,
  HardDrive,
  FileCheck
} from 'lucide-react';
import type { ApkApp } from '../types/index.ts';

interface ProfilePageProps {
  apps: ApkApp[];
  onSelectApp: (app: ApkApp) => void;
  onNavigate: (view: string, params?: any) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  apps,
  onSelectApp,
  onNavigate,
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoVerifySha, setAutoVerifySha] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([
    apps[0]?.id || 'nova_vpn',
    apps[1]?.id || 'cyberstrike'
  ]);

  const favoriteApps = apps.filter((a) => favorites.includes(a.id));

  const handleToggleFavorite = (appId: string) => {
    setFavorites((prev) => 
      prev.includes(appId) ? prev.filter((id) => id !== appId) : [...prev, appId]
    );
  };

  return (
    <div className="space-y-6 pb-20 pt-1">
      
      {/* 1. PROFILE HEADER */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#00875a] text-white flex items-center justify-center font-black text-2xl shadow-md shadow-[#00875a]/20 border-2 border-white">
            <span>U</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 truncate">
                Android Explorer
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#00875a] border border-emerald-200">
                Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">
              user@nova-market.android
            </p>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
              <span>Member since 2026</span>
              <span>•</span>
              <span className="text-[#00875a] font-semibold">NovaAPK Pro Active</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
          <div className="p-2 rounded-2xl bg-slate-50">
            <p className="text-lg font-black text-slate-900">3</p>
            <p className="text-[11px] font-medium text-slate-500">Downloads</p>
          </div>
          <div className="p-2 rounded-2xl bg-slate-50">
            <p className="text-lg font-black text-slate-900">{favorites.length}</p>
            <p className="text-[11px] font-medium text-slate-500">Favorites</p>
          </div>
          <div className="p-2 rounded-2xl bg-slate-50">
            <p className="text-lg font-black text-[#00875a]">100%</p>
            <p className="text-[11px] font-medium text-slate-500">Safe Hashes</p>
          </div>
        </div>
      </div>

      {/* 2. FAVORITES / SAVED APPS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Saved Favorites</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            {favoriteApps.length} apps
          </span>
        </div>

        {favoriteApps.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-2xl border border-slate-200/90 text-xs text-slate-500">
            No saved favorite applications yet. Tap the heart icon on any app details page to save it here.
          </div>
        ) : (
          <div className="space-y-2">
            {favoriteApps.map((app) => (
              <div
                key={app.id}
                onClick={() => onSelectApp(app)}
                className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200/90 hover:border-[#00875a]/50 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={app.iconUrl}
                    alt={app.name}
                    className="w-11 h-11 rounded-xl object-cover border border-slate-100 shadow-2xs flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#00875a] truncate">
                      {app.name}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">
                      {app.category} • v{app.version}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(app.id);
                    }}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove from favorites"
                  >
                    <Heart className="w-4 h-4 fill-rose-500" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. SETTINGS & PREFERENCES */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">
          Preferences & Security
        </h2>

        <div className="rounded-2xl bg-white border border-slate-200/90 divide-y divide-slate-100">
          
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#00875a]" />
              <div>
                <p className="text-sm font-bold text-slate-800">Auto-Verify SHA-256 Hashes</p>
                <p className="text-xs text-slate-400">Validate cryptographic signature before saving APK</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoVerifySha}
              onChange={(e) => setAutoVerifySha(e.target.checked)}
              className="w-4 h-4 accent-[#00875a] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-bold text-slate-800">App Update Notifications</p>
                <p className="text-xs text-slate-400">Receive alerts when downloaded APKs have newer releases</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-4 h-4 accent-[#00875a] cursor-pointer"
            />
          </div>

          <button
            onClick={() => onNavigate('downloads')}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <HardDrive className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-bold text-slate-800">Downloaded APK Files Manager</p>
                <p className="text-xs text-slate-400">Manage downloaded APK storage cache and local installers</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => onNavigate('report-app')}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-amber-500" />
              <div>
                <p className="text-sm font-bold text-slate-800">Report Inappropriate APK or Bug</p>
                <p className="text-xs text-slate-400">Submit a security or copyright triage ticket</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

        </div>
      </div>

      {/* 4. LOGOUT BUTTON */}
      <button
        onClick={() => {
          alert('You have signed out of your NovaAPK account session.');
          onNavigate('home');
        }}
        className="w-full py-3 rounded-2xl bg-white border border-slate-200/90 text-rose-600 hover:bg-rose-50 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>Log Out of NovaAPK Account</span>
      </button>

    </div>
  );
};
