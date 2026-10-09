import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Scale, 
  Lock, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import type { ApkApp } from '../types/index.ts';

// 1. ABOUT PAGE
export const AboutPage: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 pt-1 text-slate-700 text-sm leading-relaxed">
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-2xs space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#00875a] text-xs font-bold">
          About NovaAPK Marketplace
        </div>
        
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
          Championing Open, Verified Android Distribution
        </h1>

        <p className="text-sm sm:text-base text-slate-600">
          NovaAPK is an independent, non-walled garden marketplace built for Android power users, gamers, and software developers who believe software should be accessible without restrictive platform monopolies.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <ShieldCheck className="w-6 h-6 text-[#00875a]" />
            <h4 className="font-bold text-slate-900 text-base">Security-First Pipeline</h4>
            <p className="text-xs text-slate-500">
              Every package is verified against known signatures, scanned for trojans, and inspected via Gemini AI static heuristics.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <Lock className="w-6 h-6 text-purple-600" />
            <h4 className="font-bold text-slate-900 text-base">Distribution Rights</h4>
            <p className="text-xs text-slate-500">
              Uploaders must certify legal rights to distribute. We respect copyright holders and maintain a rapid-triage DMCA process.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <h4 className="font-bold text-slate-900 text-base">Developer Autonomy</h4>
            <p className="text-xs text-slate-500">
              Low publishing barriers, transparent promotion slots, and clean monetization with real-time download telemetry.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">Ready to distribute your package?</span>
          <button
            onClick={() => onNavigate('developer')}
            className="px-5 py-2 bg-[#00875a] hover:bg-[#00744e] text-white text-xs font-bold rounded-full shadow-xs"
          >
            Open Developer Console
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. CONTACT PAGE
export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 pt-1 text-slate-700 text-sm">
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-2xs space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Get in Touch</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Reach out for developer partnerships, DMCA inquiries, or developer support
          </p>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#00875a] flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Message Dispatched</h3>
            <p className="text-xs text-slate-500">Our operations team will respond to {email} within 24 business hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00875a]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@company.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00875a]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Message or Legal Notice</label>
              <textarea
                rows={4}
                required
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Provide details about your question, partnership, or compliance ticket..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00875a]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#00875a] hover:bg-[#00744e] text-white font-bold rounded-full shadow-xs flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Inquiries</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// 3. PRIVACY POLICY
export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 pt-1 text-slate-700 text-sm leading-relaxed">
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-2xs space-y-5">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Privacy Policy</h1>
        <p className="text-xs text-slate-400">Effective Date: October 2026 • NovaAPK Platform</p>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900">1. Information We Collect</h3>
          <p className="text-xs text-slate-600">
            NovaAPK requires no account registration for public APK downloads. When developers submit applications, we collect developer account emails, publisher company names, and cryptographic checksums of submitted binaries.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900">2. Download Telemetry & Safety Audits</h3>
          <p className="text-xs text-slate-600">
            Download metrics are maintained for aggregate ecosystem statistics. No personal identifying information (PII) from downloading devices is harvested or shared with third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900">3. AI Static Heuristics</h3>
          <p className="text-xs text-slate-600">
            Package manifests and metadata are inspected by server-side Gemini AI models solely to detect security anomalies, Trojan vectors, and dangerous permission disclosures.
          </p>
        </section>
      </div>
    </div>
  );
};

// 4. TERMS OF SERVICE
export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 pt-1 text-slate-700 text-sm leading-relaxed">
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-2xs space-y-5">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Terms of Service</h1>
        <p className="text-xs text-slate-400">Effective Date: October 2026 • NovaAPK Platform</p>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900">1. Publisher Warranties & Rights Certification</h3>
          <p className="text-xs text-slate-600">
            Any party uploading an Android package to NovaAPK expressly warrants that they possess legitimate copyright, distribution authorization, or open-source licenses for the software. Uploading pirated or copyrighted material without permission results in immediate blacklisting.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900">2. Security Disclaimers & Demo Data Notice</h3>
          <p className="text-xs text-slate-600">
            While NovaScan executes SHA-256 validation and Gemini analysis on binaries, users install APK packages at their own discretion. Demo packages in the platform are explicitly marked with a "Demo" badge.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900">3. Paid Placement & Refunds</h3>
          <p className="text-xs text-slate-600">
            Fees for promotional placement and verified publishing slots are processed and validated server-side. Refunds may be requested and disbursed through the administrative review panel.
          </p>
        </section>
      </div>
    </div>
  );
};

// 5. STANDALONE REPORT APP PAGE
export const StandaloneReportPage: React.FC<{
  apps: ApkApp[];
  onOpenReportModal: (app: ApkApp) => void;
}> = ({ apps, onOpenReportModal }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 pt-1 text-slate-700 text-sm">
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-2xs space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold mb-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Community Security & Compliance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Report Inappropriate or Malicious APK</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            NovaAPK strictly prohibits trojans, spyware, deceptive ad wrappers, and copyright infringement. Select an app to trigger an immediate audit.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-base">Select Application to Report</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {apps.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={app.iconUrl} alt={app.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs" />
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{app.name}</p>
                    <p className="text-slate-400 font-mono text-[10px] truncate">{app.packageName}</p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenReportModal(app)}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl transition-all cursor-pointer flex-shrink-0"
                >
                  Report
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
