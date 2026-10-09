import React, { useState, useEffect } from 'react';
import type { ApkApp } from './types/index.ts';
import { Navbar } from './components/Navbar.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { Footer } from './components/Footer.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { AppDetailsPage } from './pages/AppDetailsPage.tsx';
import { CategoriesPage } from './pages/CategoriesPage.tsx';
import { GamesPage } from './pages/GamesPage.tsx';
import { SearchPage } from './pages/SearchPage.tsx';
import { DownloadsPage } from './pages/DownloadsPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { BrowsePage } from './pages/BrowsePage.tsx';
import { DeveloperPortal } from './pages/DeveloperPortal.tsx';
import { AdminPanel } from './pages/AdminPanel.tsx';
import { 
  AboutPage, 
  ContactPage, 
  PrivacyPage, 
  TermsPage, 
  StandaloneReportPage 
} from './pages/StaticPages.tsx';
import { DownloadModal } from './components/DownloadModal.tsx';
import { ReviewModal } from './components/ReviewModal.tsx';
import { ReportModal } from './components/ReportModal.tsx';
import { FirebaseGuideModal } from './components/FirebaseGuideModal.tsx';

// Helper to resolve route from URL pathname
function getViewFromPath(pathname: string): { view: string; id?: string } {
  const clean = pathname.toLowerCase().replace(/\/$/, '') || '/';
  if (clean === '/developer') return { view: 'developer' };
  if (clean === '/admin') return { view: 'admin' };
  if (clean === '/categories') return { view: 'categories' };
  if (clean === '/games') return { view: 'games' };
  if (clean === '/downloads') return { view: 'downloads' };
  if (clean === '/profile') return { view: 'profile' };
  if (clean === '/search') return { view: 'search' };
  if (clean === '/about') return { view: 'about' };
  if (clean === '/contact') return { view: 'contact' };
  if (clean === '/privacy') return { view: 'privacy' };
  if (clean === '/terms') return { view: 'terms' };
  if (clean === '/report-app') return { view: 'report-app' };
  if (clean.startsWith('/app/')) {
    const appId = clean.replace('/app/', '');
    return { view: 'app-details', id: appId };
  }
  return { view: 'home' };
}

// Helper to get URL path from view
function getPathFromView(view: string, params?: any): string {
  if (view === 'developer') return '/developer';
  if (view === 'admin') return '/admin';
  if (view === 'categories') return '/categories';
  if (view === 'games') return '/games';
  if (view === 'downloads') return '/downloads';
  if (view === 'profile') return '/profile';
  if (view === 'search') return '/search';
  if (view === 'about') return '/about';
  if (view === 'contact') return '/contact';
  if (view === 'privacy') return '/privacy';
  if (view === 'terms') return '/terms';
  if (view === 'report-app') return '/report-app';
  if (view === 'app-details' && params?.appId) return `/app/${params.appId}`;
  return '/';
}

export default function App() {
  const [apps, setApps] = useState<ApkApp[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize view from real URL pathname
  const initialRoute = getViewFromPath(window.location.pathname);
  const [currentView, setCurrentView] = useState<string>(initialRoute.view);
  const [selectedApp, setSelectedApp] = useState<ApkApp | null>(null);
  const [searchInitialQuery, setSearchInitialQuery] = useState<string>('');
  const [browseParams, setBrowseParams] = useState<{
    category?: string;
    search?: string;
    sort?: string;
  }>({});
  const [developerInitialTab, setDeveloperInitialTab] = useState<'dashboard' | 'submit' | 'monetize'>('dashboard');

  // Modals state
  const [downloadingApp, setDownloadingApp] = useState<ApkApp | null>(null);
  const [reviewingApp, setReviewingApp] = useState<ApkApp | null>(null);
  const [reportingApp, setReportingApp] = useState<ApkApp | null>(null);
  const [firebaseGuideOpen, setFirebaseGuideOpen] = useState(false);

  // Fetch all apps from server
  const fetchApps = async () => {
    try {
      const res = await fetch('/api/apps?includeAll=true');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setApps(data.data);
        // If initial route was app details, find and set
        if (initialRoute.view === 'app-details' && initialRoute.id) {
          const found = data.data.find((a: ApkApp) => a.id === initialRoute.id);
          if (found) setSelectedApp(found);
        }
      }
    } catch (err) {
      console.error('Failed to fetch apps:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  // Listen to browser Back/Forward popstate events
  useEffect(() => {
    const handlePopState = () => {
      const route = getViewFromPath(window.location.pathname);
      setCurrentView(route.view);
      if (route.view === 'app-details' && route.id && apps.length > 0) {
        const found = apps.find((a) => a.id === route.id);
        if (found) setSelectedApp(found);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [apps]);

  // Unified navigation handler that updates URL and view
  const handleNavigate = (view: string, params?: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);

    const newPath = getPathFromView(view, params);
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }

    if (view === 'app-details' && params?.appId) {
      const found = apps.find((a) => a.id === params.appId);
      if (found) setSelectedApp(found);
    } else if (view === 'search') {
      setSearchInitialQuery(params?.query || '');
    } else if (view === 'browse') {
      setBrowseParams({
        category: params?.category || 'All',
        search: params?.search || '',
        sort: params?.sort || 'popular',
      });
    } else if (view === 'developer' && params?.tab) {
      setDeveloperInitialTab(params.tab);
    }
  };

  const handleSelectApp = (app: ApkApp) => {
    setSelectedApp(app);
    handleNavigate('app-details', { appId: app.id });
  };

  const handleAppCreated = (newApp: ApkApp) => {
    setApps((prev) => [newApp, ...prev]);
  };

  const handleAppUpdated = (updatedApp: ApkApp) => {
    setApps((prev) =>
      prev.map((a) => (a.id === updatedApp.id ? updatedApp : a))
    );
    if (selectedApp && selectedApp.id === updatedApp.id) {
      setSelectedApp(updatedApp);
    }
  };

  const handleDownloadIncremented = (updatedCount: number) => {
    if (downloadingApp) {
      setApps((prev) =>
        prev.map((a) =>
          a.id === downloadingApp.id
            ? { ...a, downloadCount: updatedCount }
            : a
        )
      );
      if (selectedApp && selectedApp.id === downloadingApp.id) {
        setSelectedApp((prev) =>
          prev ? { ...prev, downloadCount: updatedCount } : null
        );
      }
    }
  };

  const isPortalView = currentView === 'developer' || currentView === 'admin';

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f4f6fa] text-[#0f172a] selection:bg-[#00875a]/20 selection:text-[#00875a]">
      
      {/* Top Header Navbar on Public Site (hidden or replaced with minimal brand on dedicated portal views) */}
      {!isPortalView && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          apps={apps}
        />
      )}

      {/* Main Responsive Content Area */}
      <main className={`flex-1 w-full mx-auto px-4 pt-3 ${isPortalView ? 'max-w-5xl pb-16' : 'max-w-2xl pb-12'}`}>
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-[#00875a] rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-500">
              Loading NovaAPK Marketplace...
            </p>
          </div>
        ) : (
          <>
            {/* 1. PUBLIC WEBSITE: / (Homepage) */}
            {currentView === 'home' && (
              <HomePage
                apps={apps}
                onSelectApp={handleSelectApp}
                onDownloadApp={(app) => setDownloadingApp(app)}
                onNavigate={handleNavigate}
                onOpenFirebaseGuide={() => setFirebaseGuideOpen(true)}
              />
            )}

            {/* 2. DEDICATED DEVELOPER PORTAL: /developer */}
            {currentView === 'developer' && (
              <DeveloperPortal
                apps={apps}
                initialTab={developerInitialTab}
                onAppCreated={handleAppCreated}
                onSelectApp={handleSelectApp}
                onRefreshApps={fetchApps}
                onNavigateHome={() => handleNavigate('home')}
              />
            )}

            {/* 3. DEDICATED ADMIN PANEL: /admin */}
            {currentView === 'admin' && (
              <AdminPanel
                apps={apps}
                onAppUpdated={handleAppUpdated}
                onRefreshData={fetchApps}
                onOpenFirebaseGuide={() => setFirebaseGuideOpen(true)}
                onNavigateHome={() => handleNavigate('home')}
              />
            )}

            {/* 4. PUBLIC CATEGORIES PAGE: /categories */}
            {currentView === 'categories' && (
              <CategoriesPage
                apps={apps}
                onSelectApp={handleSelectApp}
                onDownloadApp={(app) => setDownloadingApp(app)}
                onNavigate={handleNavigate}
              />
            )}

            {/* 5. PUBLIC GAMES PAGE: /games */}
            {currentView === 'games' && (
              <GamesPage
                apps={apps}
                onSelectApp={handleSelectApp}
                onDownloadApp={(app) => setDownloadingApp(app)}
                onNavigate={handleNavigate}
              />
            )}

            {/* 6. PUBLIC SEARCH PAGE: /search */}
            {currentView === 'search' && (
              <SearchPage
                apps={apps}
                initialQuery={searchInitialQuery}
                onSelectApp={handleSelectApp}
                onDownloadApp={(app) => setDownloadingApp(app)}
                onNavigate={handleNavigate}
              />
            )}

            {/* 7. PUBLIC DOWNLOADS PAGE: /downloads */}
            {currentView === 'downloads' && (
              <DownloadsPage
                apps={apps}
                onSelectApp={handleSelectApp}
                onDownloadApp={(app) => setDownloadingApp(app)}
                onNavigate={handleNavigate}
              />
            )}

            {/* 8. PUBLIC PROFILE PAGE: /profile */}
            {currentView === 'profile' && (
              <ProfilePage
                apps={apps}
                onSelectApp={handleSelectApp}
                onNavigate={handleNavigate}
              />
            )}

            {/* 9. PUBLIC APP DETAILS PAGE */}
            {currentView === 'app-details' && selectedApp && (
              <AppDetailsPage
                app={selectedApp}
                allApps={apps}
                onBack={() => handleNavigate('home')}
                onSelectApp={handleSelectApp}
                onDownloadClick={(app) => setDownloadingApp(app)}
                onOpenReviewModal={(app) => setReviewingApp(app)}
                onOpenReportModal={(app) => setReportingApp(app)}
              />
            )}

            {/* 10. PUBLIC BROWSE PAGE */}
            {currentView === 'browse' && (
              <BrowsePage
                apps={apps}
                initialCategory={browseParams.category}
                initialSearch={browseParams.search}
                initialSort={browseParams.sort}
                onSelectApp={handleSelectApp}
                onDownloadApp={(app) => setDownloadingApp(app)}
              />
            )}

            {/* 11. PUBLIC INFO & LEGAL PAGES */}
            {currentView === 'about' && (
              <AboutPage onNavigate={handleNavigate} />
            )}

            {currentView === 'contact' && (
              <ContactPage />
            )}

            {currentView === 'privacy' && (
              <PrivacyPage />
            )}

            {currentView === 'terms' && (
              <TermsPage />
            )}

            {currentView === 'report-app' && (
              <StandaloneReportPage
                apps={apps}
                onOpenReportModal={(app) => setReportingApp(app)}
              />
            )}
          </>
        )}
      </main>

      {/* Global Footer (shown on public site) */}
      {!isPortalView && (
        <Footer
          onNavigate={handleNavigate}
          theme="light"
        />
      )}

      {/* Fixed Mobile Bottom Navigation Bar (Home, Apps, Games, Updates, Profile) */}
      {!isPortalView && (
        <BottomNav
          currentView={currentView}
          onNavigate={handleNavigate}
        />
      )}

      {/* Download Progress Modal */}
      {downloadingApp && (
        <DownloadModal
          app={downloadingApp}
          onClose={() => setDownloadingApp(null)}
          onDownloadIncremented={handleDownloadIncremented}
        />
      )}

      {/* Review Modal */}
      {reviewingApp && (
        <ReviewModal
          app={reviewingApp}
          onClose={() => setReviewingApp(null)}
          onReviewSubmitted={handleAppUpdated}
        />
      )}

      {/* Report Modal */}
      {reportingApp && (
        <ReportModal
          app={reportingApp}
          onClose={() => setReportingApp(null)}
        />
      )}

      {/* Firebase Setup Guide Modal */}
      <FirebaseGuideModal
        isOpen={firebaseGuideOpen}
        onClose={() => setFirebaseGuideOpen(false)}
      />

    </div>
  );
}
