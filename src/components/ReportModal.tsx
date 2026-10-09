import React, { useState } from 'react';
import { AlertTriangle, X, CheckCircle2, ShieldAlert } from 'lucide-react';
import type { ApkApp } from '../types/index.ts';

interface ReportModalProps {
  app: ApkApp;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ app, onClose }) => {
  const [reason, setReason] = useState<'MALWARE' | 'COPYRIGHT' | 'SCAM_OR_FRAUD' | 'BROKEN_APP' | 'INAPPROPRIATE_CONTENT' | 'OTHER'>('MALWARE');
  const [details, setDetails] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) {
      setError('Please provide specific details explaining the report.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: app.id,
          appName: app.name,
          reason,
          details: details.trim(),
          reporterEmail: email.trim() || 'anonymous@reporter.net',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || 'Report could not be logged');
      }
    } catch (err: any) {
      setError(err.message || 'Network submission error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white border border-slate-200/90 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Report Application</h3>
              <p className="text-xs text-slate-500 truncate max-w-[220px]">{app.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 bg-emerald-50 text-[#00875a] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Report Successfully Logged</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Our automated Gemini scan pipeline and security triage team have received your report for {app.name}.
            </p>
            <button
              onClick={onClose}
              className="mt-3 px-6 py-2 bg-[#00875a] text-white text-xs font-bold rounded-full"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Violation Category</label>
              <select
                value={reason}
                onChange={(e: any) => setReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00875a]"
              >
                <option value="MALWARE">Malware / Trojan / Spyware</option>
                <option value="COPYRIGHT">Copyright / Intellectual Property</option>
                <option value="SCAM_OR_FRAUD">Scam, Phishing, or Financial Fraud</option>
                <option value="BROKEN_APP">Fatal Crash / Broken Package</option>
                <option value="INAPPROPRIATE_CONTENT">Inappropriate or Offensive Material</option>
                <option value="OTHER">Other Compliance Concern</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Details & Evidence</label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Explain the specific issue observed in this APK..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00875a]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Email (for resolution updates)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="reporter@domain.com"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00875a]"
              />
            </div>

            {error && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">{error}</p>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-full"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-full shadow-xs disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
