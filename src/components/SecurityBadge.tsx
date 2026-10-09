import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertCircle, CheckCircle2, Info, ChevronRight, X } from 'lucide-react';
import type { SecurityScanReport } from '../types/index.ts';

interface SecurityBadgeProps {
  security: SecurityScanReport;
  size?: 'sm' | 'md' | 'lg';
  showDetailsButton?: boolean;
  theme?: 'dark' | 'light';
}

export const SecurityBadge: React.FC<SecurityBadgeProps> = ({ 
  security, 
  size = 'md',
  showDetailsButton = true,
  theme = 'dark'
}) => {
  const [showModal, setShowModal] = useState(false);

  const isHighSafety = security.safetyScore >= 90;
  const isModerate = security.safetyScore >= 75 && security.safetyScore < 90;

  const badgeColor = theme === 'light'
    ? isHighSafety 
      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold shadow-xs' 
      : isModerate 
      ? 'bg-amber-50 text-amber-800 border-amber-300 font-semibold shadow-xs' 
      : 'bg-rose-50 text-rose-800 border-rose-300 font-semibold shadow-xs'
    : isHighSafety 
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
      : isModerate 
      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
      : 'bg-rose-500/10 text-rose-400 border-rose-500/30';

  return (
    <>
      <div className="inline-flex items-center gap-1.5">
        <div 
          onClick={(e) => {
            if (showDetailsButton) {
              e.stopPropagation();
              setShowModal(true);
            }
          }}
          className={`inline-flex items-center gap-1.5 rounded-full font-semibold border transition-all cursor-pointer hover:brightness-110 ${badgeColor} ${
            size === 'sm' ? 'px-2 py-0.5 text-[11px]' : size === 'lg' ? 'px-3.5 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'
          }`}
          title="Click to view security audit report"
        >
          {isHighSafety ? (
            <ShieldCheck className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
          ) : (
            <ShieldAlert className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
          )}
          <span>
            {security.threatsDetected === 0 ? 'Verified Clean' : `${security.threatsDetected} Threats Flagged`} ({security.safetyScore}/100)
          </span>
          {showDetailsButton && (
            <Info className="w-3 h-3 opacity-60 ml-0.5" />
          )}
        </div>
      </div>

      {/* Security Audit Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(false);
          }}
        >
          <div 
            className="bg-[#0b101d] border border-slate-700 w-full max-w-xl rounded-2xl p-6 shadow-2xl space-y-5 text-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">APK Security Audit Report</h3>
                  <p className="text-xs text-slate-400">Scanned by {security.engine}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score & Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-center">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Safety Score</p>
                <p className="text-2xl font-black text-emerald-400 mt-0.5">{security.safetyScore}<span className="text-xs text-slate-400">/100</span></p>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-center">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Threats Found</p>
                <p className="text-2xl font-black text-emerald-400 mt-0.5">{security.threatsDetected}</p>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-center">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Target Android</p>
                <p className="text-2xl font-black text-blue-400 mt-0.5">API {security.targetSdk}</p>
              </div>
            </div>

            {/* AI Summary */}
            {security.aiAnalysisSummary && (
              <div className="bg-purple-950/20 border border-purple-800/40 p-3.5 rounded-xl space-y-1">
                <p className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  Gemini AI Heuristics Analysis
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {security.aiAnalysisSummary}
                </p>
              </div>
            )}

            {/* Cryptographic Signatures */}
            <div className="space-y-2 text-xs">
              <p className="font-semibold text-slate-300">File Cryptographic Hashes</p>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 break-all space-y-1">
                <p><span className="text-slate-400">SHA-256: </span>{security.sha256}</p>
                <p><span className="text-slate-400">MD5: </span>{security.md5}</p>
              </div>
            </div>

            {/* Permissions list */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-300">
                Verified Android Permissions ({security.permissions?.length || 0})
              </p>
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                {security.permissions?.map((p, idx) => (
                  <div key={idx} className="flex items-start justify-between p-2 rounded-lg bg-slate-900/50 border border-slate-800/60 text-xs">
                    <div>
                      <p className="font-mono text-[11px] text-blue-300">{p.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{p.description}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ml-2 flex-shrink-0 ${
                      p.level === 'DANGEROUS' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {p.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 text-center border-t border-slate-800">
              Scanned on {new Date(security.scannedAt).toLocaleString()} • Distribution rights signed by publisher
            </div>
          </div>
        </div>
      )}
    </>
  );
};
