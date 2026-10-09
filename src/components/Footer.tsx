import React from 'react';
import { ShieldCheck, Download, Lock, FileText, HelpCircle, AlertTriangle, Smartphone } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, params?: any) => void;
  onOpenFirebaseGuide?: () => void;
  theme?: 'dark' | 'light';
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200/90 mt-12 pt-12 pb-24 bg-white text-slate-600">
      <div className="max-w-2xl mx-auto px-4">
        
        {/* Brand & Intro */}
        <div className="space-y-4 pb-8 border-b border-slate-100">
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer group inline-flex"
          >
            <div className="w-9 h-9 rounded-2xl bg-[#00875a] flex items-center justify-center text-white font-black text-lg shadow-sm">
              N
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Nova<span className="text-[#00875a]">APK</span>
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            The official open Android marketplace engineered for security-first distribution. Every uploaded APK undergoes static manifest analysis, SHA-256 validation, and Gemini AI heuristic audits.
          </p>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00875a]" /> 100% Inspected
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-[11px]">
              <Lock className="w-3.5 h-3.5 text-slate-500" /> Rights Certified
            </span>
          </div>
        </div>

        {/* Quick Link Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-6 text-xs border-b border-slate-100">
          
          <div className="space-y-2">
            <p className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Marketplace</p>
            <ul className="space-y-1.5 text-slate-600">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#00875a] cursor-pointer">
                  Homepage
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('categories')} className="hover:text-[#00875a] cursor-pointer">
                  Apps & Categories
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('games')} className="hover:text-[#00875a] cursor-pointer">
                  Top Android Games
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('downloads')} className="hover:text-[#00875a] cursor-pointer">
                  My Downloads & Updates
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Resources</p>
            <ul className="space-y-1.5 text-slate-600">
              <li>
                <button onClick={() => onNavigate('downloads')} className="hover:text-[#00875a] cursor-pointer">
                  APK Installation Guide
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('categories')} className="hover:text-[#00875a] cursor-pointer">
                  Verified Security Standards
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('profile')} className="hover:text-[#00875a] cursor-pointer">
                  User Preferences & History
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#00875a] cursor-pointer">
                  Integrity Guarantee
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2 col-span-2 sm:col-span-1">
            <p className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Compliance & Help</p>
            <ul className="space-y-1.5 text-slate-600">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#00875a] cursor-pointer">
                  About NovaAPK
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#00875a] cursor-pointer">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-[#00875a] cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-[#00875a] cursor-pointer">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('report-app')} className="hover:text-rose-600 cursor-pointer font-semibold text-rose-600">
                  Report Malicious App
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-6 text-[11px] text-slate-400 space-y-2">
          <p>
            Android is a registered trademark of Google LLC. NovaAPK is an independent open APK distribution platform and is not endorsed by or affiliated with Google.
          </p>
          <div className="flex items-center justify-between text-slate-500">
            <span>© {new Date().getFullYear()} NovaAPK Marketplace. All rights reserved.</span>
            <span className="font-mono text-[10px]">Direct APK Distribution</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
