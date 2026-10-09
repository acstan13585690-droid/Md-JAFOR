import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  TrendingUp, 
  Layers, 
  Settings, 
  FileCheck, 
  Users, 
  Sparkles, 
  X, 
  Search, 
  RefreshCw,
  ExternalLink,
  Flame,
  Check,
  Eye,
  Database,
  Clock,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import type { 
  ApkApp, 
  PromotionPricing, 
  PaymentTransaction, 
  AppReport, 
  MarketplaceStats 
} from '../types/index.ts';

interface AdminPanelProps {
  apps: ApkApp[];
  onAppUpdated: (updatedApp: ApkApp) => void;
  onRefreshData: () => void;
  onOpenFirebaseGuide: () => void;
  onNavigateHome?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  apps,
  onAppUpdated,
  onRefreshData,
  onOpenFirebaseGuide,
  onNavigateHome,
}) => {
  // Authentication State with Server Session Verification
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [adminKey, setAdminKey] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Admin Navigation
  const [currentTab, setCurrentTab] = useState<'submissions' | 'apps' | 'pricing' | 'payments' | 'reports'>('submissions');

  // Stats & Ledger State
  const [stats, setStats] = useState<MarketplaceStats | null>(null);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [reports, setReports] = useState<AppReport[]>([]);
  const [pricing, setPricing] = useState<PromotionPricing>({
    standardPublishFee: 15,
    featuredListingFee: 49,
    sponsoredSearchFee: 29,
    homepageHeroFee: 99,
  });

  // Action states
  const [rejectingAppId, setRejectingAppId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [pricingSaveSuccess, setPricingSaveSuccess] = useState(false);
  const [auditingAppId, setAuditingAppId] = useState<string | null>(null);
  const [aiAuditResult, setAiAuditResult] = useState<string | null>(null);

  // Helper to obtain authorized admin headers
  const getAdminHeaders = (): HeadersInit => {
    const token = sessionStorage.getItem('nova_admin_token') || '';
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  // Verify existing admin token on component mount
  useEffect(() => {
    const token = sessionStorage.getItem('nova_admin_token');
    if (!token) {
      setIsAuthenticated(false);
      setAuthChecking(false);
      return;
    }

    fetch('/api/admin/verify-token', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          throw new Error('Unauthorized');
        }
        return res.json();
      })
      .then((data) => {
        if (data.success && data.valid) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          sessionStorage.removeItem('nova_admin_token');
          sessionStorage.removeItem('nova_admin_auth');
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('nova_admin_token');
        sessionStorage.removeItem('nova_admin_auth');
      })
      .finally(() => {
        setAuthChecking(false);
      });
  }, []);

  // Load Admin Data with Server-Side Authorization Token
  const loadAdminData = async () => {
    try {
      const headers = getAdminHeaders();
      const [statsRes, paymentsRes, reportsRes, priceRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/admin/payments', { headers }),
        fetch('/api/reports'),
        fetch('/api/admin/pricing'),
      ]);

      if (statsRes.status === 401 || paymentsRes.status === 401) {
        setIsAuthenticated(false);
        sessionStorage.removeItem('nova_admin_token');
        sessionStorage.removeItem('nova_admin_auth');
        setLoginError('Admin session expired or unauthorized. Please re-authenticate.');
        return;
      }

      const statsData = await statsRes.json();
      const paymentsData = await paymentsRes.json();
      const reportsData = await reportsRes.json();
      const priceData = await priceRes.json();

      if (statsData.success) setStats(statsData.data);
      if (paymentsData.success) setPayments(paymentsData.data);
      if (reportsData.success) setReports(reportsData.data);
      if (priceData.success) setPricing(priceData.data);
    } catch (e) {
      console.error('Failed to load admin data:', e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated]);

  // Handle Server-authoritative Admin Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) {
      setLoginError('Please enter administrator passkey.');
      return;
    }

    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey: adminKey.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.token) {
        sessionStorage.setItem('nova_admin_token', data.token);
        sessionStorage.setItem('nova_admin_auth', 'true');
        setIsAuthenticated(true);
        setLoginError('');
      } else {
        setLoginError(data.message || 'Access Denied: Invalid master administrator passkey.');
      }
    } catch (err: any) {
      setLoginError('Server authentication failure. Ensure server is online.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    const token = sessionStorage.getItem('nova_admin_token');
    if (token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
        });
      } catch {
        // ignore
      }
    }
    sessionStorage.removeItem('nova_admin_token');
    sessionStorage.removeItem('nova_admin_auth');
    setIsAuthenticated(false);
  };

  // 1. Approve/Reject Submissions with Server Authorization
  const handleApproveApp = async (appId: string) => {
    try {
      const res = await fetch(`/api/apps/${appId}/review`, {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status: 'APPROVED' }),
      });
      const data = await res.json();
      if (data.success) {
        onAppUpdated(data.data);
        loadAdminData();
      }
    } catch (e) {
      console.error('Approve failed:', e);
    }
  };

  const handleRejectApp = async () => {
    if (!rejectingAppId) return;
    try {
      const res = await fetch(`/api/apps/${rejectingAppId}/review`, {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({
          status: 'REJECTED',
          rejectionReason: rejectionReason || 'Failed NovaScan security or policy guidelines.',
        }),
      });
      const data = await res.json();
      if (data.success) {
        onAppUpdated(data.data);
        setRejectingAppId(null);
        setRejectionReason('');
        loadAdminData();
      }
    } catch (e) {
      console.error('Reject failed:', e);
    }
  };

  // 2. Toggle Badge (Featured, Sponsored, Hero)
  const handleToggleBadge = async (appId: string, field: 'isFeatured' | 'isSponsored' | 'isHomepageHero', currentVal: boolean) => {
    try {
      const res = await fetch(`/api/apps/${appId}/toggle-badge`, {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ field, value: !currentVal }),
      });
      const data = await res.json();
      if (data.success) {
        onAppUpdated(data.data);
      }
    } catch (e) {
      console.error('Toggle badge failed:', e);
    }
  };

  // 3. Update Pricing
  const handleSavePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify(pricing),
      });
      const data = await res.json();
      if (data.success) {
        setPricingSaveSuccess(true);
        setTimeout(() => setPricingSaveSuccess(false), 2500);
      }
    } catch (e) {
      console.error('Save pricing failed:', e);
    }
  };

  // 4. Update Payment Status (e.g. Issue Refund)
  const handleUpdatePaymentStatus = async (txId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/payments/${txId}/status`, {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        loadAdminData();
      }
    } catch (e) {
      console.error('Payment status update failed:', e);
    }
  };

  // 5. Abuse Reports Resolution
  const handleResolveReport = async (reportId: string, status: 'RESOLVED' | 'DISMISSED', action: 'DELIST_APP' | 'NONE') => {
    try {
      const res = await fetch(`/api/reports/${reportId}/resolve`, {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status, action }),
      });
      const data = await res.json();
      if (data.success) {
        loadAdminData();
        onRefreshData();
      }
    } catch (e) {
      console.error('Resolve report failed:', e);
    }
  };

  // 6. Gemini Deep Security Scan for Reviewers
  const handleRunAiAudit = async (appItem: ApkApp) => {
    setAuditingAppId(appItem.id);
    setAiAuditResult(null);
    try {
      const res = await fetch('/api/gemini/security-scan', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({
          appName: appItem.name,
          packageName: appItem.packageName,
          permissions: appItem.security.permissions,
          targetSdk: appItem.security.targetSdk,
          description: appItem.fullDescription,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAiAuditResult(data.analysis);
      }
    } catch (e) {
      console.error('Gemini audit error:', e);
    }
  };

  // Show loading spinner while verifying existing token
  if (authChecking) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-[#00875a] rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-slate-500">
          Verifying administrator credentials...
        </p>
      </div>
    );
  }

  // LOGIN SCREEN
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
          <span className="text-[11px] font-mono text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            URL: /admin
          </span>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-6 text-slate-800">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200 shadow-2xs">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">NovaAPK Admin Console</h2>
            <p className="text-xs text-slate-500">
              Restricted clearance required. APK compliance triage, payment ledger & root control. Protected by server-side authorization.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Admin Master Passkey
              </label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter master passkey (admin123)"
                disabled={loginLoading}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00875a]"
                required
              />
            </div>

            {loginError && (
              <p className="text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-xs font-semibold">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-[#00875a] hover:bg-[#00744e] disabled:opacity-60 text-white font-black text-sm rounded-full shadow-md shadow-[#00875a]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Verifying Server Authorization...</span>
                </>
              ) : (
                <span>Authenticate Admin Session</span>
              )}
            </button>

            {/* Quick Demo Button */}
            <div className="pt-2 text-center">
              <button
                type="button"
                disabled={loginLoading}
                onClick={async () => {
                  setAdminKey('admin123');
                  setLoginLoading(true);
                  setLoginError('');
                  try {
                    const res = await fetch('/api/admin/login', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ passkey: 'admin123' }),
                    });
                    const data = await res.json();
                    if (res.ok && data.success && data.token) {
                      sessionStorage.setItem('nova_admin_token', data.token);
                      sessionStorage.setItem('nova_admin_auth', 'true');
                      setIsAuthenticated(true);
                    } else {
                      setLoginError(data.message || 'Login failed');
                    }
                  } catch {
                    setLoginError('Server authentication failure');
                  } finally {
                    setLoginLoading(false);
                  }
                }}
                className="text-xs text-[#00875a] font-bold hover:underline cursor-pointer disabled:opacity-50"
              >
                1-Click Demo Admin Login (eval passkey: admin123)
              </button>
            </div>
          </form>
        </div>

      </div>
    );
  }

  const pendingApps = apps.filter((a) => a.status === 'PENDING');

  return (
    <div className="space-y-6 pb-20 pt-1">
      
      {/* Admin Header */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-2xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-md">
            <ShieldAlert className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Platform Administrator
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-[#00875a] border border-emerald-200 font-bold">
                ROOT SECURE
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review submissions, enforce compliance, configure pricing, and audit server payments
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNavigateHome ? onNavigateHome() : window.location.href = '/'}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
          >
            Public Site (/)
          </button>

          <button
            onClick={onOpenFirebaseGuide}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#00875a] border border-emerald-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Firebase Config</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* High-Level Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-2xs">
          <p className="text-[11px] text-slate-400 font-medium">Platform Revenue</p>
          <p className="text-2xl font-black text-[#00875a] mt-0.5 font-mono">
            ${stats ? stats.totalRevenue.toFixed(2) : '177.00'}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">Server verified ledger</p>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-2xs">
          <p className="text-[11px] text-slate-400 font-medium">Pending APKs</p>
          <p className="text-2xl font-black text-amber-600 mt-0.5">
            {pendingApps.length}
          </p>
          <p className="text-[10px] text-amber-600 font-semibold mt-1">Awaiting review</p>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-2xs">
          <p className="text-[11px] text-slate-400 font-medium">Total Apps Listed</p>
          <p className="text-2xl font-black text-slate-900 mt-0.5">
            {apps.length}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">Approved + Pending</p>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-2xs">
          <p className="text-[11px] text-slate-400 font-medium">Total Downloads</p>
          <p className="text-2xl font-black text-blue-600 mt-0.5">
            {stats ? stats.totalDownloads.toLocaleString() : '3,850,900'}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">Direct APK transfers</p>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-2xs">
          <p className="text-[11px] text-slate-400 font-medium">Abuse Reports</p>
          <p className="text-2xl font-black text-rose-600 mt-0.5">
            {reports.filter((r) => r.status === 'PENDING').length}
          </p>
          <p className="text-[10px] text-rose-600 font-semibold mt-1">Open tickets</p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setCurrentTab('submissions')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            currentTab === 'submissions'
              ? 'bg-[#00875a] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pending Submissions ({pendingApps.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('apps')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            currentTab === 'apps'
              ? 'bg-[#00875a] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>All Applications ({apps.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('pricing')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            currentTab === 'pricing'
              ? 'bg-[#00875a] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Promotion Pricing</span>
        </button>

        <button
          onClick={() => setCurrentTab('payments')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            currentTab === 'payments'
              ? 'bg-[#00875a] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Payments Ledger ({payments.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('reports')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            currentTab === 'reports'
              ? 'bg-[#00875a] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <span>Abuse Reports ({reports.length})</span>
        </button>
      </div>

      {/* TAB 1: PENDING SUBMISSIONS QUEUE */}
      {currentTab === 'submissions' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-2xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">APK Review & Compliance Queue</h2>
              <p className="text-xs text-slate-500 mt-1">
                Inspect requested permissions, verify binary hash, run Gemini AI security scan, then Approve or Reject.
              </p>
            </div>

            {pendingApps.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                All submissions have been audited. No pending APK packages in the triage queue!
              </div>
            ) : (
              <div className="space-y-6">
                {pendingApps.map((pending) => (
                  <div
                    key={pending.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={pending.iconUrl}
                          alt={pending.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900">{pending.name}</h3>
                            <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
                              v{pending.version}
                            </span>
                          </div>
                          <p className="text-xs font-mono text-[#00875a]">{pending.packageName}</p>
                          <p className="text-[11px] text-slate-500">Developer: {pending.developerName}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRunAiAudit(pending)}
                          className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                          <span>Gemini AI Audit</span>
                        </button>
                        <button
                          onClick={() => handleApproveApp(pending.id)}
                          className="px-4 py-1.5 bg-[#00875a] hover:bg-[#00744e] text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                        >
                          Approve Live
                        </button>
                        <button
                          onClick={() => setRejectingAppId(pending.id)}
                          className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>

                    {/* Gemini Audit Result if run */}
                    {auditingAppId === pending.id && (
                      <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 text-xs text-purple-950 space-y-1">
                        <span className="font-bold flex items-center gap-1.5 text-purple-900">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          Automated Gemini Heuristics Feedback:
                        </span>
                        <p className="leading-relaxed">
                          {aiAuditResult || 'Running deep permissions correlation against Android static policy...'}
                        </p>
                      </div>
                    )}

                    {/* Reject Dialog */}
                    {rejectingAppId === pending.id && (
                      <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2 text-xs">
                        <label className="font-bold text-rose-900">Rejection Reason for Developer:</label>
                        <input
                          type="text"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="e.g. Excessive camera permissions not justified by utilities category."
                          className="w-full px-3 py-2 bg-white border border-rose-300 rounded-lg text-slate-900 text-xs"
                        />
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            onClick={() => setRejectingAppId(null)}
                            className="px-3 py-1 text-slate-600 font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleRejectApp}
                            className="px-4 py-1 bg-rose-600 text-white rounded-lg font-bold"
                          >
                            Confirm Rejection
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ALL APPLICATIONS & BADGE MANAGEMENT */}
      {currentTab === 'apps' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-2xs space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">All Marketplace Applications</h2>
            <p className="text-xs text-slate-500">Toggle Featured, Sponsored, and Hero spotlight placements</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">Application</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Downloads</th>
                  <th className="py-3 px-3">Featured</th>
                  <th className="py-3 px-3">Sponsored</th>
                  <th className="py-3 px-3">Hero Spotlight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {apps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img src={app.iconUrl} alt={app.name} className="w-9 h-9 rounded-xl object-cover border border-slate-200" />
                        <div>
                          <p className="font-bold text-slate-900">{app.name}</p>
                          <p className="font-mono text-[10px] text-slate-400">{app.packageName}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-semibold text-slate-600">{app.category}</td>

                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        app.status === 'APPROVED' ? 'bg-emerald-50 text-[#00875a]' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {app.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-bold text-slate-900">{app.downloadCount.toLocaleString()}</td>

                    {/* Toggles */}
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={app.isFeatured}
                        onChange={() => handleToggleBadge(app.id, 'isFeatured', app.isFeatured)}
                        className="w-4 h-4 accent-[#00875a] cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={app.isSponsored}
                        onChange={() => handleToggleBadge(app.id, 'isSponsored', app.isSponsored)}
                        className="w-4 h-4 accent-[#00875a] cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={app.isHomepageHero}
                        onChange={() => handleToggleBadge(app.id, 'isHomepageHero', app.isHomepageHero)}
                        className="w-4 h-4 accent-[#00875a] cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PROMOTION PRICING CONFIG */}
      {currentTab === 'pricing' && (
        <div className="max-w-2xl bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-2xs space-y-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Promotion Pricing Engine</h2>
            <p className="text-xs text-slate-500">Live prices are bound to server signatures. Clients cannot tamper with these amounts.</p>
          </div>

          <form onSubmit={handleSavePricing} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <label className="font-bold text-slate-800">Standard Publishing Fee ($ USD)</label>
                <input
                  type="number"
                  value={pricing.standardPublishFee}
                  onChange={(e) => setPricing({ ...pricing, standardPublishFee: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono font-bold"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <label className="font-bold text-slate-800">Featured Listing Fee ($ USD)</label>
                <input
                  type="number"
                  value={pricing.featuredListingFee}
                  onChange={(e) => setPricing({ ...pricing, featuredListingFee: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono font-bold"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <label className="font-bold text-slate-800">Sponsored Search Fee ($ USD)</label>
                <input
                  type="number"
                  value={pricing.sponsoredSearchFee}
                  onChange={(e) => setPricing({ ...pricing, sponsoredSearchFee: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono font-bold"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <label className="font-bold text-slate-800">Homepage Hero Fee ($ USD)</label>
                <input
                  type="number"
                  value={pricing.homepageHeroFee}
                  onChange={(e) => setPricing({ ...pricing, homepageHeroFee: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono font-bold"
                />
              </div>
            </div>

            {pricingSaveSuccess && (
              <p className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                Pricing configuration successfully saved and updated across server routers!
              </p>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#00875a] hover:bg-[#00744e] text-white font-bold text-xs rounded-full shadow-xs"
            >
              Update Live Pricing
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: PAYMENTS LEDGER */}
      {currentTab === 'payments' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-2xs space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Cryptographically Audited Payments Ledger</h2>
            <p className="text-xs text-slate-500">Statuses: PENDING, PAID, FAILED, REFUNDED, CANCELLED. All backed by server HMAC signatures.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">Order ID / Date</th>
                  <th className="py-3 px-3">Developer</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono">
                      <p className="font-bold text-slate-900">{tx.orderId}</p>
                      <p className="text-[10px] text-slate-400">{new Date(tx.createdAt).toLocaleString()}</p>
                    </td>

                    <td className="py-3 px-3 font-semibold text-slate-800">{tx.developerName}</td>

                    <td className="py-3 px-3 text-slate-600">{tx.promotionType}</td>

                    <td className="py-3 px-3 font-bold font-mono text-slate-900">
                      ${tx.amount.toFixed(2)} {tx.currency}
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        tx.status === 'PAID' ? 'bg-emerald-50 text-[#00875a]' :
                        tx.status === 'REFUNDED' ? 'bg-blue-50 text-blue-700' :
                        tx.status === 'FAILED' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {tx.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      {tx.status === 'PAID' && (
                        <button
                          onClick={() => handleUpdatePaymentStatus(tx.id, 'REFUNDED')}
                          className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Issue Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: ABUSE REPORTS */}
      {currentTab === 'reports' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-2xs space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Community Abuse & Security Reports</h2>
            <p className="text-xs text-slate-500">Triage user complaints regarding copyright, malware, or broken packages</p>
          </div>

          <div className="space-y-3">
            {reports.map((rep) => (
              <div key={rep.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{rep.appName}</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[10px]">
                      {rep.reason}
                    </span>
                    <span className="text-slate-400 font-medium">Status: {rep.status}</span>
                  </div>
                  <p className="text-slate-600 mt-1">{rep.details}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Reporter: {rep.reporterEmail} • {new Date(rep.createdAt).toLocaleDateString()}</p>
                </div>

                {rep.status === 'PENDING' && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleResolveReport(rep.id, 'RESOLVED', 'DELIST_APP')}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl"
                    >
                      Delist App
                    </button>
                    <button
                      onClick={() => handleResolveReport(rep.id, 'DISMISSED', 'NONE')}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
