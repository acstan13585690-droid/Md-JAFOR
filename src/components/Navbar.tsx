import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  X, 
  Grid, 
  Gamepad2, 
  Home, 
  Download, 
  User, 
  Info,
  Mail,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import type { ApkApp } from '../types/index.ts';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, params?: any) => void;
  apps: ApkApp[];
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentView, 
  onNavigate, 
  apps 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('search', { query: searchQuery.trim() });
    } else {
      onNavigate('search', {});
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      <div className="max-w-2xl mx-auto px-4 pt-3 pb-3 space-y-3">
        
        {/* Top Header Row: Logo, Bell, Menu */}
        <div className="flex items-center justify-between">
          
          {/* NovaAPK Brand Logo */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            {/* Green Circular/Squircle Brand Icon */}
            <div className="w-10 h-10 rounded-2xl bg-[#00875a] flex items-center justify-center text-white font-black text-xl shadow-md shadow-[#00875a]/25 group-hover:scale-105 transition-transform">
              <span className="tracking-tighter">N</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-[#0f172a] leading-none">
                Nova<span className="text-[#00875a]">APK</span>
              </span>
              <span className="text-[11px] font-medium text-slate-400 leading-tight mt-0.5">
                Android Apps & Games
              </span>
            </div>
          </div>

          {/* Right Action Icons: Bell & Hamburger Menu */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setHasNotifications(false);
                onNavigate('downloads');
              }}
              className="relative p-2.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Downloads & Updates"
            >
              <Bell className="w-5 h-5 stroke-[2.2px]" />
              {hasNotifications && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#00875a] ring-2 ring-white animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="p-2.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Menu"
            >
              {drawerOpen ? <X className="w-6 h-6 stroke-[2.2px]" /> : <Menu className="w-6 h-6 stroke-[2.2px]" />}
            </button>
          </div>

        </div>

        {/* Full-width Search Bar with Green Search Button */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <div className="relative flex items-center bg-[#f4f6fa] border border-slate-200/90 rounded-full px-3.5 py-1.5 shadow-2xs focus-within:bg-white focus-within:border-[#00875a] focus-within:ring-2 focus-within:ring-[#00875a]/15 transition-all">
            <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for apps, games, or developers..."
              className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 mr-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="submit"
              className="w-8 h-8 rounded-full bg-[#00875a] hover:bg-[#00744e] text-white flex items-center justify-center flex-shrink-0 shadow-xs transition-all ml-0.5 active:scale-95 cursor-pointer"
              title="Search"
            >
              <Search className="w-4 h-4 stroke-[2.5px]" />
            </button>
          </div>
        </form>

      </div>

      {/* Slide-Down Navigation Drawer (Public Navigation Only) */}
      {drawerOpen && (
        <div className="border-t border-slate-100 bg-white shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-2xl mx-auto p-4 space-y-3">
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm font-semibold text-slate-700">
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  onNavigate('home');
                }}
                className={`flex items-center gap-2.5 p-3 rounded-2xl transition-all cursor-pointer ${
                  currentView === 'home'
                    ? 'bg-[#00875a]/10 text-[#00875a] font-bold'
                    : 'bg-slate-50 hover:bg-[#00875a]/10 hover:text-[#00875a]'
                }`}
              >
                <Home className="w-4 h-4 text-[#00875a]" />
                <span>Home</span>
              </button>

              <button
                onClick={() => {
                  setDrawerOpen(false);
                  onNavigate('categories');
                }}
                className={`flex items-center gap-2.5 p-3 rounded-2xl transition-all cursor-pointer ${
                  currentView === 'categories'
                    ? 'bg-[#00875a]/10 text-[#00875a] font-bold'
                    : 'bg-slate-50 hover:bg-[#00875a]/10 hover:text-[#00875a]'
                }`}
              >
                <Grid className="w-4 h-4 text-blue-600" />
                <span>Categories</span>
              </button>

              <button
                onClick={() => {
                  setDrawerOpen(false);
                  onNavigate('games');
                }}
                className={`flex items-center gap-2.5 p-3 rounded-2xl transition-all cursor-pointer ${
                  currentView === 'games'
                    ? 'bg-[#00875a]/10 text-[#00875a] font-bold'
                    : 'bg-slate-50 hover:bg-[#00875a]/10 hover:text-[#00875a]'
                }`}
              >
                <Gamepad2 className="w-4 h-4 text-amber-600" />
                <span>Games</span>
              </button>

              <button
                onClick={() => {
                  setDrawerOpen(false);
                  onNavigate('downloads');
                }}
                className={`flex items-center gap-2.5 p-3 rounded-2xl transition-all cursor-pointer ${
                  currentView === 'downloads'
                    ? 'bg-[#00875a]/10 text-[#00875a] font-bold'
                    : 'bg-slate-50 hover:bg-[#00875a]/10 hover:text-[#00875a]'
                }`}
              >
                <Download className="w-4 h-4 text-[#00875a]" />
                <span>Downloads</span>
              </button>
            </div>

            {/* Public Community & Information Links */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  onNavigate('profile');
                }}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200/80 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#00875a]" />
                  User Profile
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setDrawerOpen(false);
                  onNavigate('about');
                }}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200/80 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  About Platform
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setDrawerOpen(false);
                  onNavigate('contact');
                }}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200/80 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  Contact Us
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

          </div>
        </div>
      )}

    </header>
  );
};
