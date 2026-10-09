import React, { useState } from 'react';
import { 
  Download, 
  Star, 
  ShieldCheck, 
  Calendar, 
  HardDrive, 
  Smartphone, 
  CheckCircle2, 
  AlertTriangle, 
  Share2, 
  ChevronLeft, 
  History, 
  MessageSquare, 
  ShieldAlert, 
  Copy, 
  Check, 
  ExternalLink,
  Sparkles,
  Info,
  Heart
} from 'lucide-react';
import type { ApkApp } from '../types/index.ts';
import { SecurityBadge } from '../components/SecurityBadge.tsx';
import { AppCard } from '../components/AppCard.tsx';

interface AppDetailsPageProps {
  app: ApkApp;
  allApps: ApkApp[];
  onBack: () => void;
  onSelectApp: (app: ApkApp) => void;
  onDownloadClick: (app: ApkApp) => void;
  onOpenReviewModal: (app: ApkApp) => void;
  onOpenReportModal: (app: ApkApp) => void;
}

export const AppDetailsPage: React.FC<AppDetailsPageProps> = ({
  app,
  allApps,
  onBack,
  onSelectApp,
  onDownloadClick,
  onOpenReviewModal,
  onOpenReportModal,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'security' | 'versions' | 'reviews'>('overview');
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Related apps
  const relatedApps = allApps
    .filter((a) => a.id !== app.id && a.category === app.category && a.status === 'APPROVED')
    .slice(0, 3);

  const handleCopySha = () => {
    navigator.clipboard.writeText(app.security.sha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${app.name} APK Download - NovaAPK`,
        text: `Download verified ${app.name} v${app.version} on NovaAPK Marketplace`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };

  return (
    <div className="space-y-6 pb-20 pt-1">
      
      {/* Top Navigation Bar: Back & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all shadow-2xs cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5px]" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              isFavorite 
                ? 'bg-rose-50 border-rose-200 text-rose-600' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Save to favorites"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all cursor-pointer relative"
            title="Share App"
          >
            <Share2 className="w-4 h-4" />
            {shareSuccess && (
              <span className="absolute -top-7 right-0 text-[10px] font-bold bg-[#00875a] text-white px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                Link copied!
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 1. APP HERO CARD (Clean White Card with Large Icon, Details & Green Download Button) */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6">
        
        {/* Main Header Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <img
              src={app.iconUrl}
              alt={app.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-slate-100 shadow-md flex-shrink-0"
            />
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {app.name}
                </h1>
                {app.isSponsored && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    AD
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-500 font-medium truncate flex items-center gap-1.5">
                <span>By {app.developerName}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00875a]" />
              </p>

              <div className="flex items-center gap-3 pt-1 text-xs sm:text-sm flex-wrap">
                <span className="flex items-center gap-1 font-bold text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {app.rating}
                  <span className="text-slate-400 font-normal">
                    ({app.ratingCount.toLocaleString()})
                  </span>
                </span>
                <span className="text-slate-300">•</span>
                <span className="font-semibold text-slate-700">
                  {app.downloadCount.toLocaleString()} downloads
                </span>
                <span className="text-slate-300">•</span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                  {app.category}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Prominent Green Download APK Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={() => onDownloadClick(app)}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#00875a] hover:bg-[#00744e] text-white font-black text-sm sm:text-base shadow-md shadow-[#00875a]/25 transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
          >
            <Download className="w-5 h-5 stroke-[2.5px]" />
            <span>Download APK ({app.apkSizeMb} MB)</span>
          </button>

          <button
            onClick={() => onOpenReviewModal(app)}
            className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer"
          >
            Write Review
          </button>
        </div>

        {/* Key Specification Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-center">
          <div className="p-2.5 rounded-2xl bg-slate-50">
            <p className="text-[11px] text-slate-400 font-medium">Version</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">v{app.version}</p>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50">
            <p className="text-[11px] text-slate-400 font-medium">File Size</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">{app.apkSizeMb} MB</p>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50">
            <p className="text-[11px] text-slate-400 font-medium">Requires Android</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">{app.security.targetSdk ? `${app.security.targetSdk}.0+` : '8.0+'}</p>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50">
            <p className="text-[11px] text-slate-400 font-medium">Safety Score</p>
            <p className="text-sm font-bold text-[#00875a] mt-0.5">{app.security.safetyScore}/100 Clean</p>
          </div>
        </div>

      </div>


      {/* 2. SCREENSHOTS CAROUSEL */}
      {app.screenshots && app.screenshots.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">
            App Previews & Screenshots
          </h2>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {app.screenshots.map((shot, idx) => (
              <img
                key={idx}
                src={shot}
                alt={`${app.name} preview ${idx + 1}`}
                onClick={() => setSelectedScreenshot(shot)}
                className="h-56 sm:h-64 rounded-2xl object-cover border border-slate-200/90 shadow-2xs hover:shadow-md cursor-pointer transition-transform hover:scale-[1.02] flex-shrink-0"
              />
            ))}
          </div>
        </div>
      )}


      {/* 3. TABS NAVIGATION */}
      <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#00875a] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Description
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'security'
              ? 'bg-[#00875a] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Security Audit
        </button>

        <button
          onClick={() => setActiveTab('versions')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'versions'
              ? 'bg-[#00875a] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Changelog
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'reviews'
              ? 'bg-[#00875a] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Reviews ({app.reviews?.length || 0})
        </button>
      </div>


      {/* 4. TAB CONTENT */}
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              About {app.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line font-normal">
              {app.fullDescription || app.shortDescription}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 mb-2">Package Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between p-2 rounded-xl bg-slate-50">
                <span className="text-slate-400">Package Name:</span>
                <span className="font-mono font-semibold text-slate-700">{app.packageName}</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-slate-50">
                <span className="text-slate-400">Version Code:</span>
                <span className="font-mono font-semibold text-slate-700">{app.versionCode}</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-slate-50">
                <span className="text-slate-400">Published:</span>
                <span className="font-semibold text-slate-700">{new Date(app.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-slate-50">
                <span className="text-slate-400">Distribution Rights:</span>
                <span className="font-semibold text-[#00875a]">Certified & Verified</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-[#00875a]" />
              <h3 className="text-base font-bold text-slate-900">
                NovaScan™ & Gemini AI Security Audit
              </h3>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Clean Score: {app.security.safetyScore}/100
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 space-y-2">
            <p className="text-xs font-bold text-slate-700">Cryptographic SHA-256 Checksum:</p>
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-600 break-all">
              <span>{app.security.sha256}</span>
              <button
                onClick={handleCopySha}
                className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-sans font-semibold flex-shrink-0"
              >
                {copiedHash ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {app.security.aiAnalysisSummary && (
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100 space-y-1 text-xs text-blue-900">
              <span className="font-bold flex items-center gap-1.5 text-blue-800">
                <Sparkles className="w-3.5 h-3.5" />
                Gemini Static Analysis Summary
              </span>
              <p className="leading-relaxed">{app.security.aiAnalysisSummary}</p>
            </div>
          )}

          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-2">Declared Android Permissions ({app.security.permissions.length})</h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {app.security.permissions.map((perm, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-700">{perm.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    perm.level === 'DANGEROUS' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {perm.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Versions Tab */}
      {activeTab === 'versions' && (
        <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Version History</h3>
          <div className="space-y-3">
            {app.versionHistory?.map((ver, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">Version {ver.version} (Build {ver.versionCode})</span>
                  <span className="text-slate-400">{ver.releaseDate}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{ver.changelog}</p>
                <div className="text-[11px] text-slate-400">{ver.apkSizeMb} MB APK</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Community Reviews</h3>
            <button
              onClick={() => onOpenReviewModal(app)}
              className="px-3 py-1.5 rounded-full bg-[#00875a] text-white text-xs font-bold"
            >
              Write Review
            </button>
          </div>

          <div className="space-y-2.5">
            {app.reviews?.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No reviews submitted yet. Be the first!</p>
            ) : (
              app.reviews?.map((rev) => (
                <div key={rev.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{rev.userName}</span>
                    <span className="text-amber-500 text-xs font-bold flex items-center gap-0.5">
                      ★ {rev.rating}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{rev.comment}</p>
                  <span className="text-[10px] text-slate-400">{rev.createdAt}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Report Button */}
      <div className="text-center pt-2">
        <button
          onClick={() => onOpenReportModal(app)}
          className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors inline-flex items-center gap-1 cursor-pointer"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Report security violation, malware or copyright issue</span>
        </button>
      </div>

      {/* Related Apps Row */}
      {relatedApps.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <h3 className="text-base font-bold text-slate-900">
            More in {app.category}
          </h3>

          <div className="space-y-2">
            {relatedApps.map((rel) => (
              <AppCard
                key={rel.id}
                app={rel}
                variant="horizontal"
                onSelect={onSelectApp}
                onDownloadClick={onDownloadClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Screenshot Fullscreen Preview Modal */}
      {selectedScreenshot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          onClick={() => setSelectedScreenshot(null)}
        >
          <img
            src={selectedScreenshot}
            alt="Fullscreen preview"
            className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
          />
        </div>
      )}

    </div>
  );
};
