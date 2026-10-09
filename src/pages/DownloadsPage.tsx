import React, { useState } from 'react';
import { 
  Download, 
  CheckCircle2, 
  Clock, 
  HardDrive, 
  Trash2, 
  RefreshCw, 
  ShieldCheck, 
  ExternalLink,
  Smartphone,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import type { ApkApp } from '../types/index.ts';

interface DownloadsPageProps {
  apps: ApkApp[];
  onSelectApp: (app: ApkApp) => void;
  onDownloadApp: (app: ApkApp) => void;
  onNavigate: (view: string, params?: any) => void;
}

interface DownloadHistoryItem {
  id: string;
  appId: string;
  appName: string;
  packageName: string;
  version: string;
  sizeMb: number;
  fileName: string;
  status: 'COMPLETED' | 'VERIFIED' | 'UPDATE_AVAILABLE';
  downloadDate: string;
  iconUrl: string;
  sha256: string;
}

export const DownloadsPage: React.FC<DownloadsPageProps> = ({
  apps,
  onSelectApp,
  onDownloadApp,
  onNavigate,
}) => {
  // Initial seed download history
  const [history, setHistory] = useState<DownloadHistoryItem[]>([
    {
      id: 'dl_1',
      appId: apps[0]?.id || 'nova_vpn',
      appName: apps[0]?.name || 'Nova VPN Pro',
      packageName: apps[0]?.packageName || 'com.nova.vpn.secure',
      version: apps[0]?.version || '2.4.1',
      sizeMb: apps[0]?.apkSizeMb || 18.4,
      fileName: `${apps[0]?.packageName || 'com.nova.vpn'}_v${apps[0]?.version || '2.4.1'}.apk`,
      status: 'VERIFIED',
      downloadDate: 'Today, 10:14 AM',
      iconUrl: apps[0]?.iconUrl || 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200&auto=format&fit=crop&q=80',
      sha256: apps[0]?.security?.sha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    },
    {
      id: 'dl_2',
      appId: apps[1]?.id || 'cyberstrike',
      appName: apps[1]?.name || 'CyberStrike 2088',
      packageName: apps[1]?.packageName || 'com.cyberforge.strike2088',
      version: apps[1]?.version || '1.8.0',
      sizeMb: apps[1]?.apkSizeMb || 85.2,
      fileName: `${apps[1]?.packageName || 'com.cyberforge.strike2088'}_v1.8.0.apk`,
      status: 'UPDATE_AVAILABLE',
      downloadDate: 'Yesterday, 4:32 PM',
      iconUrl: apps[1]?.iconUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&auto=format&fit=crop&q=80',
      sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
    },
    {
      id: 'dl_3',
      appId: apps[2]?.id || 'photopro',
      appName: apps[2]?.name || 'PhotoPro AI Enhancer',
      packageName: apps[2]?.packageName || 'com.aurora.photopro.ai',
      version: apps[2]?.version || '3.2.0',
      sizeMb: apps[2]?.apkSizeMb || 34.6,
      fileName: `${apps[2]?.packageName || 'com.aurora.photopro'}_v3.2.0.apk`,
      status: 'COMPLETED',
      downloadDate: '3 days ago',
      iconUrl: apps[2]?.iconUrl || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&auto=format&fit=crop&q=80',
      sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
    }
  ]);

  const [installGuideOpen, setInstallGuideOpen] = useState(false);

  const totalDownloadedSize = history.reduce((acc, item) => acc + item.sizeMb, 0).toFixed(1);

  const handleClearHistory = () => {
    if (confirm('Clear all local APK download history?')) {
      setHistory([]);
    }
  };

  const handleRemoveItem = (id: string) => {
    setHistory((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-6 pb-20 pt-1">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00875a]">
            <Download className="w-4 h-4" />
            <span>Local Storage & Packages</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Downloads & Updates
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            View downloaded APK binaries, check update availability, and verify file integrity
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 text-xs font-semibold hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Storage and Verification Summary Card */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00875a]/10 flex items-center justify-center text-[#00875a]">
              <HardDrive className="w-5 h-5 stroke-[2.2px]" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                Downloaded APK Storage
              </p>
              <p className="text-xs text-slate-500">
                {history.length} Packages • {totalDownloadedSize} MB Total Cached
              </p>
            </div>
          </div>

          <button
            onClick={() => setInstallGuideOpen(true)}
            className="flex items-center gap-1 text-xs font-bold text-[#00875a] hover:underline"
          >
            <span>How to Install APKs</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-2.5 text-xs text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-[#00875a] flex-shrink-0" />
          <span>All packages in your history have passed the cryptographic SHA-256 integrity check.</span>
        </div>
      </div>

      {/* Downloads History List */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">
          Downloaded Packages ({history.length})
        </h2>

        {history.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-3xl border border-slate-200/90 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No downloads yet</h3>
            <p className="text-xs text-slate-500">
              When you download APK packages from NovaAPK, your installation records will appear here.
            </p>
            <button
              onClick={() => onNavigate('home')}
              className="px-5 py-2.5 rounded-full bg-[#00875a] text-white text-xs font-bold shadow-xs hover:bg-[#00744e]"
            >
              Explore Top Apps
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {history.map((item) => {
              const matchedApp = apps.find((a) => a.id === item.appId || a.name === item.appName);

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <img
                        src={item.iconUrl}
                        alt={item.appName}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-2xs flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {item.appName}
                        </h4>
                        <p className="text-xs font-mono text-slate-400 truncate mt-0.5">
                          {item.fileName}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <span className="text-slate-500 font-medium">
                            {item.sizeMb} MB
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-400">
                            {item.downloadDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      {item.status === 'UPDATE_AVAILABLE' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          <RefreshCw className="w-3 h-3 text-amber-600 animate-spin" />
                          Update
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-[#00875a]" />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        if (matchedApp) onSelectApp(matchedApp);
                      }}
                      className="font-bold text-slate-600 hover:text-[#00875a] transition-colors"
                    >
                      View Details
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (matchedApp) onDownloadApp(matchedApp);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#00875a] hover:bg-[#00744e] text-white font-bold transition-all"
                      >
                        <Download className="w-3 h-3 stroke-[2.5px]" />
                        <span>Re-download</span>
                      </button>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Remove from history"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* APK Installation Guide Modal */}
      {installGuideOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setInstallGuideOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#00875a]" />
                How to Install APKs on Android
              </h3>
              <button 
                onClick={() => setInstallGuideOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <ol className="list-decimal list-inside space-y-2.5 text-xs text-slate-600 leading-relaxed">
              <li>Tap the <strong>Download APK</strong> button on any app page.</li>
              <li>When downloaded, open the notification or find the file in your device's <strong>Downloads</strong> folder.</li>
              <li>If prompted, enable <strong>"Install Unknown Apps"</strong> in your Android Settings for your browser or file manager.</li>
              <li>Tap <strong>Install</strong> and enjoy! NovaAPK files are 100% clean and verified.</li>
            </ol>

            <button
              onClick={() => setInstallGuideOpen(false)}
              className="w-full py-2.5 rounded-full bg-[#00875a] text-white text-xs font-bold mt-2"
            >
              Got it
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
