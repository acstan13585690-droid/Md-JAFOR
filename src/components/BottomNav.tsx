import React from 'react';
import { Home, Grid, Gamepad2, RefreshCw, User } from 'lucide-react';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: string, params?: any) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
    },
    {
      id: 'categories',
      label: 'Apps',
      icon: Grid,
    },
    {
      id: 'games',
      label: 'Games',
      icon: Gamepad2,
    },
    {
      id: 'downloads',
      label: 'Updates',
      icon: RefreshCw,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      <div className="max-w-2xl mx-auto px-4 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = 
            currentView === item.id || 
            (item.id === 'categories' && currentView === 'browse') ||
            (item.id === 'home' && currentView === '');

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center justify-center py-1 px-3 min-w-[56px] transition-colors group cursor-pointer"
            >
              <div className={`p-1 rounded-xl transition-all ${
                isActive ? 'text-[#00875a]' : 'text-slate-400 group-hover:text-slate-600'
              }`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight ${
                isActive ? 'text-[#00875a] font-bold' : 'text-slate-500 font-medium'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
