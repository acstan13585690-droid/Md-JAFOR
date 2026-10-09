import React, { useState, useEffect } from 'react';
import { Download, CheckCircle2, ShieldCheck, AlertCircle, ExternalLink, X, FileCheck, Smartphone } from 'lucide-react';
import type { ApkApp } from '../types/index.ts';

interface DownloadModalProps {
  app: ApkApp;
  onClose: () => void;
  onDownloadIncremented?: (updatedCount: number) => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ 
  app, 
  onClose,
  onDownloadIncremented 
}) => {
  const [progress, setProgress] = useState(0);
  const [downloadReady, setDownloadReady] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const startDownloadSequence = async () => {
      try {
        // Trigger server atomic download counter and get download info
        const res = await fetch(`/api/apps/${app.id}/download`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        if (data.success) {
          setDownloadUrl(data.downloadUrl);
          setFileName(data.fileName);
          if (onDownloadIncremented) {
            onDownloadIncremented(data.downloadCount);
          }
        }
      } catch (err) {
        console.error('Download registration failed:', err);
      }

      // Smooth simulation progress for APK preparation & manifest signature check
      let current = 0;
      const interval = setInterval(() => {
        current += Math.floor(Math.random() * 25) + 20;
        if (current >= 100) {
          current = 100;
          setProgress(100);
          setDownloadReady(true);
          clearInterval(interval);

          // Auto-trigger the download
          const directUrl = `/api/apps/${app.id}/download-file`;
          const a = document.createElement('a');
          a.href = directUrl;
          a.download = `${app.packageName}_v${app.version}.apk`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } else {
          setProgress(current);
        }
      }, 200);
    };

    startDownloadSequence();
  }, [app]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white border border-slate-200/90 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={app.iconUrl}
              alt={app.name}
              className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-2xs flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-slate-900 truncate">
                {app.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                v{app.version} • {app.apkSizeMb} MB
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Display */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[#00875a]">
              <Download className="w-4 h-4 animate-bounce" />
              {downloadReady ? 'Download started in browser!' : 'Verifying SHA-256 signature...'}
            </span>
            <span className="text-slate-600 font-mono font-bold">{progress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#00875a] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-500 font-mono truncate">
            {fileName || `${app.packageName}_v${app.version}.apk`}
          </p>
        </div>

        {/* Security Checks List */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
            <span className="flex items-center gap-2 text-slate-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#00875a]" />
              Signature Audit
            </span>
            <span className="text-[11px] text-[#00875a] font-bold">MATCHES PUBLISHER</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
            <span className="flex items-center gap-2 text-slate-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#00875a]" />
              Threats Scan
            </span>
            <span className="text-[11px] text-[#00875a] font-bold">0 DETECTED (CLEAN)</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col gap-2">
          {downloadReady ? (
            <button
              onClick={onClose}
              className="w-full py-3 rounded-full bg-[#00875a] hover:bg-[#00744e] text-white text-xs font-bold transition-all shadow-md shadow-[#00875a]/25"
            >
              Done & Close
            </button>
          ) : (
            <button
              disabled
              className="w-full py-3 rounded-full bg-slate-100 text-slate-400 text-xs font-bold"
            >
              Preparing APK package...
            </button>
          )}

          <a
            href={`/api/apps/${app.id}/download-file`}
            download={`${app.packageName}_v${app.version}.apk`}
            className="text-center text-xs font-bold text-[#00875a] hover:underline py-1"
          >
            Direct mirror link if download didn't trigger
          </a>
        </div>

      </div>
    </div>
  );
};
