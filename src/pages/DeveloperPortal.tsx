import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Upload, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Plus, 
  Flame, 
  Search, 
  FileCheck, 
  ExternalLink,
  ChevronRight,
  UserCheck,
  Smartphone,
  Wallet,
  Lock,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import type { ApkApp, DeveloperAccount, PromotionPricing, PromotionType } from '../types/index.ts';
import { CheckoutModal } from '../components/CheckoutModal.tsx';

interface DeveloperPortalProps {
  apps: ApkApp[];
  initialTab?: 'dashboard' | 'submit' | 'monetize';
  onAppCreated: (newApp: ApkApp) => void;
  onSelectApp: (app: ApkApp) => void;
  onRefreshApps: () => void;
  onNavigateHome?: () => void;
}

export const DeveloperPortal: React.FC<DeveloperPortalProps> = ({
  apps,
  initialTab = 'dashboard',
  onAppCreated,
  onSelectApp,
  onRefreshApps,
  onNavigateHome,
}) => {
  // Developer Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('nova_dev_auth') === 'true';
  });

  const [loginEmail, setLoginEmail] = useState('dev@hyperionlabs.io');
  const [loginPassword, setLoginPassword] = useState('developer123');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [regCompanyName, setRegCompanyName] = useState('');
  const [loginError, setLoginError] = useState('');

  // Developer session info
  const [activeTab, setActiveTab] = useState<'dashboard' | 'submit' | 'monetize'>(initialTab);
  const [developerId, setDeveloperId] = useState<string>(() => {
    return sessionStorage.getItem('nova_dev_id') || 'dev_hyperion';
  });
  const [developer, setDeveloper] = useState<DeveloperAccount | null>(null);
  const [pricing, setPricing] = useState<PromotionPricing>({
    standardPublishFee: 15,
    featuredListingFee: 49,
    sponsoredSearchFee: 29,
    homepageHeroFee: 99,
  });

  // Submission Form State
  const [subName, setSubName] = useState('');
  const [subPackage, setSubPackage] = useState('');
  const [subCategory, setSubCategory] = useState('Tools');
  const [subVersion, setSubVersion] = useState('1.0.0');
  const [subVersionCode, setSubVersionCode] = useState('100');
  const [subSizeMb, setSubSizeMb] = useState('28.5');
  const [subShortDesc, setSubShortDesc] = useState('');
  const [subFullDesc, setSubFullDesc] = useState('');
  const [subIconUrl, setSubIconUrl] = useState('');
  const [subRightsConfirmed, setSubRightsConfirmed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [subSuccess, setSubSuccess] = useState(false);
  const [subError, setSubError] = useState('');

  // Gemini ASO Optimizer State
  const [optimizing, setOptimizing] = useState(false);
  const [roughNotes, setRoughNotes] = useState('');

  // Promotion Checkout State
  const [checkoutTarget, setCheckoutTarget] = useState<{
    appId?: string;
    appName?: string;
    type: PromotionType;
    price: number;
  } | null>(null);

  // Verify existing developer session token on mount
  useEffect(() => {
    const token = sessionStorage.getItem('nova_dev_token');
    if (!token) return;

    fetch('/api/developers/verify-token', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.developer) {
          setDeveloper(data.developer);
          setDeveloperId(data.developer.id);
          setIsAuthenticated(true);
        } else {
          sessionStorage.removeItem('nova_dev_token');
          sessionStorage.removeItem('nova_dev_auth');
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        // keep offline fallback if network glitch
      });
  }, []);

  // Load Developer profile and pricing
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchDevData = async () => {
      try {
        const token = sessionStorage.getItem('nova_dev_token');
        const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};

        const [devRes, priceRes] = await Promise.all([
          fetch(`/api/developers/${developerId}`, { headers }),
          fetch('/api/admin/pricing'),
        ]);
        const devData = await devRes.json();
        const priceData = await priceRes.json();
        if (devData.success) setDeveloper(devData.developer);
        if (priceData.success) setPricing(priceData.data);
      } catch (e) {
        console.error('Failed to load developer info:', e);
      }
    };
    fetchDevData();
  }, [developerId, isAuthenticated]);

  // Handle Real Login / Register Submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setLoginError('Please enter a valid developer email address.');
      return;
    }

    setLoginError('');

    try {
      if (isRegisterMode) {
        const res = await fetch('/api/developers/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: regCompanyName.trim() || loginEmail.split('@')[0],
            email: loginEmail.trim(),
            companyName: regCompanyName.trim(),
          }),
        });
        const data = await res.json();
        if (res.ok && data.success && data.developer) {
          if (data.token) sessionStorage.setItem('nova_dev_token', data.token);
          sessionStorage.setItem('nova_dev_auth', 'true');
          sessionStorage.setItem('nova_dev_id', data.developer.id);
          setDeveloperId(data.developer.id);
          setDeveloper(data.developer);
          setIsAuthenticated(true);
        } else {
          setLoginError(data.message || 'Registration failed.');
        }
      } else {
        const res = await fetch('/api/developers/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: loginEmail.trim(),
            password: loginPassword,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success && data.developer) {
          if (data.token) sessionStorage.setItem('nova_dev_token', data.token);
          sessionStorage.setItem('nova_dev_auth', 'true');
          sessionStorage.setItem('nova_dev_id', data.developer.id);
          setDeveloperId(data.developer.id);
          setDeveloper(data.developer);
          setIsAuthenticated(true);
        } else {
          setLoginError(data.message || 'Developer login failed.');
        }
      }
    } catch {
      setLoginError('Server connection error. Please try again.');
    }
  };

  const handleQuickLogin = async (id: string, email: string) => {
    setLoginEmail(email);
    setLoginError('');
    try {
      const res = await fetch('/api/developers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.developer) {
        if (data.token) sessionStorage.setItem('nova_dev_token', data.token);
        sessionStorage.setItem('nova_dev_auth', 'true');
        sessionStorage.setItem('nova_dev_id', data.developer.id);
        setDeveloperId(data.developer.id);
        setDeveloper(data.developer);
        setIsAuthenticated(true);
      }
    } catch {
      // fallback
      setDeveloperId(id);
      setIsAuthenticated(true);
      sessionStorage.setItem('nova_dev_auth', 'true');
      sessionStorage.setItem('nova_dev_id', id);
    }
  };

  const handleLogout = async () => {
    const token = sessionStorage.getItem('nova_dev_token');
    if (token) {
      try {
        await fetch('/api/developers/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
        });
      } catch {
        // ignore
      }
    }
    setIsAuthenticated(false);
    sessionStorage.removeItem('nova_dev_auth');
    sessionStorage.removeItem('nova_dev_id');
    sessionStorage.removeItem('nova_dev_token');
  };

  // Apps belonging to this developer
  const devApps = apps.filter((a) => a.developerId === developerId);
  const totalDownloads = devApps.reduce((acc, a) => acc + (a.downloadCount || 0), 0);
  const pendingCount = devApps.filter((a) => a.status === 'PENDING').length;
  const approvedCount = devApps.filter((a) => a.status === 'APPROVED').length;

  // Gemini Metadata Generator
  const handleOptimizeWithGemini = async () => {
    if (!subName.trim()) {
      alert('Please enter an App Name first so Gemini knows what to write about!');
      return;
    }
    setOptimizing(true);
    try {
      const res = await fetch('/api/tools/optimize-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appName: subName.trim(),
          category: subCategory,
          roughNotes: roughNotes.trim() || subShortDesc.trim() || 'Fast, lightweight Android utility app.',
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.shortDescription) setSubShortDesc(data.shortDescription);
        if (data.fullDescription) setSubFullDesc(data.fullDescription);
      }
    } catch (err) {
      console.error('Gemini optimization failed:', err);
    } finally {
      setOptimizing(false);
    }
  };

  // Submit Application
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subRightsConfirmed) {
      setSubError('You must legally certify distribution rights for this APK.');
      return;
    }
    if (!subName.trim() || !subPackage.trim()) {
      setSubError('App Name and Package Name are mandatory.');
      return;
    }

    setSubLoading(true);
    setSubError('');

    try {
      const res = await fetch('/api/apps/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: subName.trim(),
          packageName: subPackage.trim(),
          developerId,
          category: subCategory,
          version: subVersion.trim(),
          versionCode: Number(subVersionCode),
          apkSizeMb: parseFloat(subSizeMb),
          shortDescription: subShortDesc.trim() || 'Modern Android software package.',
          fullDescription: subFullDesc.trim() || 'Published via NovaAPK Developer Portal.',
          iconUrl: subIconUrl.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
          hasDistributionRights: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onAppCreated(data.app);
        setSubSuccess(true);
        // Reset form
        setSubName('');
        setSubPackage('');
        setSubShortDesc('');
        setSubFullDesc('');
        setSubRightsConfirmed(false);
      } else {
        setSubError(data.message || 'Submission error');
      }
    } catch (err: any) {
      setSubError(err.message || 'Network submission failed');
    } finally {
      setSubLoading(false);
    }
  };

  // 1. DEDICATED DEVELOPER LOGIN SCREEN (If not authenticated)
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-8 pb-16 space-y-5">
        
        {/* Back to Public Site Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigateHome ? onNavigateHome() : window.location.href = '/'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5px]" />
            <span>Back to Public Marketplace (/)</span>
          </button>
          <span className="text-[11px] font-mono text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
            URL: /developer
          </span>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xl space-y-6 text-slate-800">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto border border-purple-200 shadow-2xs">
              <Code2 className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">
              Developer Distribution Console
            </h1>
            <p className="text-xs text-slate-500">
              Sign in to publish Android APK binaries, track installations, and optimize store listings
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            {isRegisterMode && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Studio / Company Name *
                </label>
                <input
                  type="text"
                  value={regCompanyName}
                  onChange={(e) => setRegCompanyName(e.target.value)}
                  placeholder="e.g. Acme Mobile Games LLC"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Developer Account Email *
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="dev@studio.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Account Security Password / Passkey *
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {loginError && (
              <p className="text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-xs">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-full shadow-md shadow-purple-600/20 transition-all cursor-pointer"
            >
              {isRegisterMode ? 'Register & Open Console' : 'Sign In to Developer Console'}
            </button>
          </form>

          {/* Quick Demo Partner Logins */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <p className="text-[11px] font-bold text-slate-500 text-center uppercase tracking-wider">
              Quick 1-Click Partner Profiles
            </p>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('dev_hyperion', 'dev@hyperionlabs.io')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 hover:text-purple-700 border border-slate-200 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div>
                  <p className="font-bold text-slate-900">Hyperion Mobile Labs</p>
                  <p className="text-[10px] text-slate-500">dev@hyperionlabs.io • Tools & Security</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('dev_cyberforge', 'games@cyberforge.dev')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 hover:text-purple-700 border border-slate-200 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div>
                  <p className="font-bold text-slate-900">CyberForge Games</p>
                  <p className="text-[10px] text-slate-500">games@cyberforge.dev • Action & 3D Games</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('dev_aurora', 'contact@aurorasoft.tech')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 hover:text-purple-700 border border-slate-200 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div>
                  <p className="font-bold text-slate-900">Aurora Softworks</p>
                  <p className="text-[10px] text-slate-500">contact@aurorasoft.tech • Photo & AI Apps</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-xs text-purple-600 font-semibold hover:underline cursor-pointer"
            >
              {isRegisterMode ? 'Already registered? Sign in here' : 'Need a publisher account? Register new studio'}
            </button>
          </div>

        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED DEVELOPER DASHBOARD
  return (
    <div className="space-y-6 pb-20 pt-1">
      
      {/* Developer Header Bar */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-2xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-purple-600/20">
            <Code2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Developer Console
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-bold">
                PARTNER PORTAL
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Logged in as <strong className="text-slate-800">{developer?.companyName || 'Developer'}</strong> ({developer?.email})
            </p>
          </div>
        </div>

        {/* Profile Switcher & Logout */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={developerId}
            onChange={(e) => {
              setDeveloperId(e.target.value);
              sessionStorage.setItem('nova_dev_id', e.target.value);
            }}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none"
          >
            <option value="dev_hyperion">Hyperion Mobile Labs</option>
            <option value="dev_aurora">Aurora Softworks</option>
            <option value="dev_cyberforge">CyberForge Games</option>
          </select>

          <button
            onClick={() => onNavigateHome ? onNavigateHome() : window.location.href = '/'}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Public Site (/)
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => {
            setActiveTab('dashboard');
            setSubSuccess(false);
          }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-[#00875a] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Apps & Analytics</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('submit');
            setSubSuccess(false);
          }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'submit'
              ? 'bg-[#00875a] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Submit New APK</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('monetize');
            setSubSuccess(false);
          }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'monetize'
              ? 'bg-[#00875a] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Promote & Feature</span>
        </button>
      </div>

      {/* TAB 1: DASHBOARD & ANALYTICS */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-2xs space-y-1">
              <p className="text-xs text-slate-500 font-medium">Total APK Downloads</p>
              <p className="text-2xl font-black text-slate-900">{totalDownloads.toLocaleString()}</p>
              <p className="text-[11px] text-[#00875a] font-semibold flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 bg-[#00875a] rounded-full animate-pulse" />
                Live counter tracking
              </p>
            </div>

            <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-2xs space-y-1">
              <p className="text-xs text-slate-500 font-medium">Gross Publisher Earnings</p>
              <p className="text-2xl font-black text-[#00875a]">
                ${developer?.totalEarnings ? developer.totalEarnings.toFixed(2) : '0.00'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Available: ${developer?.balance ? developer.balance.toFixed(2) : '0.00'}
              </p>
            </div>

            <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-2xs space-y-1">
              <p className="text-xs text-slate-500 font-medium">Live Approved Apps</p>
              <p className="text-2xl font-black text-blue-600">{approvedCount}</p>
              <p className="text-[11px] text-slate-400 mt-1">Direct public availability</p>
            </div>

            <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-2xs space-y-1">
              <p className="text-xs text-slate-500 font-medium">Pending Review</p>
              <p className="text-2xl font-black text-amber-600">{pendingCount}</p>
              <p className="text-[11px] text-slate-400 mt-1">Under security audit</p>
            </div>
          </div>

          {/* Submitted Apps Table */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Your Submitted Packages</h3>
                <p className="text-xs text-slate-500">Manage statuses, promotions, and downloads</p>
              </div>

              <button
                onClick={() => setActiveTab('submit')}
                className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 bg-[#00875a] hover:bg-[#00744e] text-white font-bold text-xs rounded-full shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Submit Another APK</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-3">Application</th>
                    <th className="py-3 px-3">Package / Version</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Downloads</th>
                    <th className="py-3 px-3">Promotions</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {devApps.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.iconUrl}
                            alt={item.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{item.name}</p>
                            <p className="text-slate-400 text-[11px]">{item.category}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-mono text-[11px]">
                        <p className="text-slate-800">{item.packageName}</p>
                        <p className="text-slate-400">v{item.version} ({item.apkSizeMb} MB)</p>
                      </td>

                      <td className="py-3.5 px-3">
                        {item.status === 'APPROVED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#00875a]" /> Approved
                          </span>
                        )}
                        {item.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <Clock className="w-3.5 h-3.5 text-amber-600" /> In Review
                          </span>
                        )}
                        {item.status === 'REJECTED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200" title={item.rejectionReason}>
                            <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Rejected
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 font-bold text-slate-900">
                        {item.downloadCount.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.isHomepageHero && (
                            <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold">
                              Hero
                            </span>
                          )}
                          {item.isFeatured && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                              Featured
                            </span>
                          )}
                          {item.isSponsored && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                              Sponsored
                            </span>
                          )}
                          {!item.isFeatured && !item.isSponsored && !item.isHomepageHero && (
                            <span className="text-slate-400 text-[11px]">Organic</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onSelectApp(item)}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              setCheckoutTarget({
                                appId: item.id,
                                appName: item.name,
                                type: 'FEATURED_LISTING',
                                price: pricing.featuredListingFee,
                              });
                            }}
                            className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                          >
                            Promote
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: SUBMIT NEW APK */}
      {activeTab === 'submit' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
            
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Submit Android APK Package</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Upload and certify your Android binary for NovaAPK security inspection
              </p>
            </div>

            {subSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-50 text-[#00875a] rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">APK Package Submitted Successfully!</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Your application has been registered with status <strong>PENDING</strong>. NovaScan automated security scanner has queued this package for manifest analysis and SHA-256 generation.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="px-5 py-2.5 rounded-full bg-[#00875a] text-white font-bold text-xs"
                  >
                    View in Developer Dashboard
                  </button>
                  <button
                    onClick={() => setSubSuccess(false)}
                    className="px-5 py-2.5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs"
                  >
                    Submit Another File
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                
                {/* Basic Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Application Name *</label>
                    <input
                      type="text"
                      value={subName}
                      onChange={(e) => setSubName(e.target.value)}
                      placeholder="e.g. PixelStudio Pro"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00875a]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Package Name * (Unique ID)</label>
                    <input
                      type="text"
                      value={subPackage}
                      onChange={(e) => setSubPackage(e.target.value)}
                      placeholder="com.developer.appname"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#00875a]"
                      required
                    />
                  </div>
                </div>

                {/* Category & Version */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Software Category</label>
                    <select
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00875a]"
                    >
                      <option value="Games">Games</option>
                      <option value="Tools">Tools</option>
                      <option value="Social">Social</option>
                      <option value="Communication">Communication</option>
                      <option value="Photography">Photography</option>
                      <option value="Media">Media</option>
                      <option value="Productivity">Productivity</option>
                      <option value="Personalization">Personalization</option>
                      <option value="Security">Security</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Version String</label>
                    <input
                      type="text"
                      value={subVersion}
                      onChange={(e) => setSubVersion(e.target.value)}
                      placeholder="1.0.0"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#00875a]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">APK Size (MB)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={subSizeMb}
                      onChange={(e) => setSubSizeMb(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#00875a]"
                      required
                    />
                  </div>
                </div>

                {/* Gemini ASO Tool Banner */}
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      Gemini AI Description & ASO Optimizer
                    </span>
                    <button
                      type="button"
                      disabled={optimizing}
                      onClick={handleOptimizeWithGemini}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-xs disabled:opacity-50 transition-all cursor-pointer shadow-xs"
                    >
                      {optimizing ? 'Writing ASO Copy...' : 'Generate with Gemini'}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={roughNotes}
                    onChange={(e) => setRoughNotes(e.target.value)}
                    placeholder="Enter keywords or rough notes (e.g. 'Fast camera with vintage filters and RAW output')..."
                    className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-slate-800 text-xs placeholder-slate-400 focus:outline-none"
                  />
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Short Description (App Card Summary)</label>
                  <input
                    type="text"
                    value={subShortDesc}
                    onChange={(e) => setSubShortDesc(e.target.value)}
                    placeholder="Crisp 1-sentence overview for marketplace search results..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00875a]"
                  />
                </div>

                {/* Full Description */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Full Description (Details Page)</label>
                  <textarea
                    rows={4}
                    value={subFullDesc}
                    onChange={(e) => setSubFullDesc(e.target.value)}
                    placeholder="Detailed feature breakdown, Android requirements, and release notes..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00875a]"
                  />
                </div>

                {/* Icon URL */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">App Icon URL</label>
                  <input
                    type="url"
                    value={subIconUrl}
                    onChange={(e) => setSubIconUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00875a]"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Leave empty to use high-res default placeholder</p>
                </div>

                {/* Legal Certification Checkbox */}
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={subRightsConfirmed}
                      onChange={(e) => setSubRightsConfirmed(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-[#00875a] cursor-pointer"
                    />
                    <span className="text-xs text-amber-900 leading-relaxed">
                      <strong>Mandatory Certification:</strong> I solemnly declare under penalty of immediate account termination and legal liability that I am the author or authorized distributor of this APK package. This file contains no trojans, keyloggers, or copyright infringing assets.
                    </span>
                  </label>
                </div>

                {subError && (
                  <p className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
                    {subError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={subLoading}
                  className="w-full py-3.5 bg-[#00875a] hover:bg-[#00744e] text-white font-bold text-sm rounded-full shadow-md shadow-[#00875a]/25 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {subLoading ? 'Running Static Analysis & Submitting...' : 'Submit APK for Security Audit'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* TAB 3: PROMOTIONS & MONETIZATION HUB */}
      {activeTab === 'monetize' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-2xs space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Promotions & Placement Tiers</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Boost your app's downloads with verified priority placement. Pricing configured live by marketplace administrators.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Option 1: Standard Publishing */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    STANDARD TIER
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2">Publishing Fee</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Compliance check and permanent cloud distribution slot.
                  </p>
                  <p className="text-3xl font-black text-slate-900 font-mono mt-4">
                    ${pricing.standardPublishFee.toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => setCheckoutTarget({
                    type: 'STANDARD_PUBLISH',
                    price: pricing.standardPublishFee,
                  })}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-full transition-all cursor-pointer"
                >
                  Purchase Slot
                </button>
              </div>

              {/* Option 2: Featured Listing */}
              <div className="bg-purple-50/50 border border-purple-200 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-300">
                    CATEGORY TOP
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2">Featured Listing</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Pinned to top of category grid with highlight badge for 7 days.
                  </p>
                  <p className="text-3xl font-black text-purple-700 font-mono mt-4">
                    ${pricing.featuredListingFee.toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => setCheckoutTarget({
                    type: 'FEATURED_LISTING',
                    price: pricing.featuredListingFee,
                  })}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-full transition-all cursor-pointer shadow-xs"
                >
                  Select App & Feature
                </button>
              </div>

              {/* Option 3: Sponsored Search */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    SEARCH PRIORITY
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2">Sponsored Search</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Top placement in relevant marketplace keyword searches.
                  </p>
                  <p className="text-3xl font-black text-indigo-700 font-mono mt-4">
                    ${pricing.sponsoredSearchFee.toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => setCheckoutTarget({
                    type: 'SPONSORED_SEARCH',
                    price: pricing.sponsoredSearchFee,
                  })}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-full transition-all cursor-pointer"
                >
                  Promote Search
                </button>
              </div>

              {/* Option 4: Homepage Hero */}
              <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    MAXIMUM REACH
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2">Homepage Hero Spotlight</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Featured prominently on the NovaAPK homepage with 1-click install action.
                  </p>
                  <p className="text-3xl font-black text-amber-700 font-mono mt-4">
                    ${pricing.homepageHeroFee.toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => setCheckoutTarget({
                    type: 'HOMEPAGE_HERO',
                    price: pricing.homepageHeroFee,
                  })}
                  className="w-full py-2 bg-[#00875a] hover:bg-[#00744e] text-white font-bold text-xs rounded-full transition-all cursor-pointer shadow-xs"
                >
                  Book Hero Spotlight
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal for Server-Verified Payment */}
      {checkoutTarget && (
        <CheckoutModal
          developerId={developerId}
          appId={checkoutTarget.appId || devApps[0]?.id}
          appName={checkoutTarget.appName || devApps[0]?.name}
          promotionType={checkoutTarget.type}
          price={checkoutTarget.price}
          onClose={() => setCheckoutTarget(null)}
          onPaymentSuccess={(tx) => {
            onRefreshApps();
            setCheckoutTarget(null);
          }}
        />
      )}

    </div>
  );
};
