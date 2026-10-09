import React, { useState } from 'react';
import { Database, Shield, Lock, Server, CloudUpload, Copy, Check, X, ExternalLink, Key, Code } from 'lucide-react';

interface FirebaseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseGuideModal: React.FC<FirebaseGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const sampleRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check authentication
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper to check if requester is platform admin
    function isAdmin() {
      return isAuthenticated() && request.auth.token.role == 'admin';
    }
    
    // Helper to check app owner
    function isAppOwner(devId) {
      return isAuthenticated() && (request.auth.uid == devId || isAdmin());
    }

    // Public Apps collection: Anyone can read approved apps
    match /apps/{appId} {
      allow read: if resource.data.status == 'APPROVED' || isAdmin() || (isAuthenticated() && request.auth.uid == resource.data.developerId);
      allow create: if isAuthenticated() && request.resource.data.developerId == request.auth.uid;
      allow update: if isAppOwner(resource.data.developerId) && (isAdmin() || request.resource.data.diff(resource.data).affectedKeys().hasOnly(['shortDescription', 'fullDescription', 'screenshots', 'updatedAt']));
      allow delete: if isAdmin();
    }

    // Developer Accounts
    match /developers/{devId} {
      allow read: if true;
      allow write: if isAuthenticated() && request.auth.uid == devId;
    }

    // Payment transactions: Strict server/admin authoritative
    match /payments/{paymentId} {
      allow read: if isAuthenticated() && (request.auth.uid == resource.data.developerId || isAdmin());
      allow write: if isAdmin(); // Never trust client browser!
    }

    // Abuse Reports: Anyone can submit, only admin can view/resolve
    match /reports/{reportId} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }
  }
}`;

  const sampleEnv = `# Firebase Client Configuration (Public variables in React)
VITE_FIREBASE_API_KEY="AIzaSyA..."
VITE_FIREBASE_AUTH_DOMAIN="nova-apk-marketplace.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="nova-apk-marketplace"
VITE_FIREBASE_STORAGE_BUCKET="nova-apk-marketplace.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
VITE_FIREBASE_APP_ID="1:123456789:web:abcdef"

# Server-Side Private Secrets (Keep inside server environment)
FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"nova-apk-marketplace",...}'
PAYMENT_HMAC_SECRET="super_secret_crypto_salt_here"
GEMINI_API_KEY="MY_GEMINI_API_KEY"`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white border border-slate-200/90 w-full max-w-3xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-800 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#00875a]/10 text-[#00875a] rounded-2xl shadow-xs">
              <Database className="w-6 h-6 stroke-[2.2px]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Production Firebase & Deployment Manual
              </h2>
              <p className="text-xs text-slate-500">
                Architecture guide for Authentication, Firestore rules, and Server-Side payments
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto pr-2 space-y-6 py-2 flex-1 text-sm">
          
          {/* Step 1 */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#00875a] text-white text-xs flex items-center justify-center font-black">1</span>
              Provision Firebase Project & Enable Services
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Open the <strong>Firebase Console</strong> (<a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-[#00875a] hover:underline inline-flex items-center gap-0.5">console.firebase.google.com <ExternalLink className="w-3 h-3" /></a>) and enable:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <li className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <p className="font-bold text-[#00875a]">Firebase Authentication</p>
                <p className="text-slate-500 mt-1">Enable Email/Password & Google Sign-In with custom claims for Developer and Admin roles.</p>
              </li>
              <li className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <p className="font-bold text-blue-600">Cloud Firestore</p>
                <p className="text-slate-500 mt-1">Create database in Production Mode with regional multi-zone redundancy.</p>
              </li>
              <li className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <p className="font-bold text-purple-600">Firebase Storage</p>
                <p className="text-slate-500 mt-1">Bucket for APK binaries (<code className="text-purple-600">/apks/*</code>) and app screenshots/icons.</p>
              </li>
            </ul>
          </div>

          {/* Step 2: Firestore Security Rules */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#00875a] text-white text-xs flex items-center justify-center font-black">2</span>
                Production Security Rules (<code className="text-xs text-[#00875a]">firestore.rules</code>)
              </h3>
              <button
                onClick={() => handleCopy(sampleRules, 'rules')}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded-lg text-slate-700 transition-all border border-slate-200"
              >
                {copiedSection === 'rules' ? <Check className="w-3.5 h-3.5 text-[#00875a]" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSection === 'rules' ? 'Copied!' : 'Copy Rules'}
              </button>
            </div>
            <pre className="bg-slate-900 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto max-h-48">
              {sampleRules}
            </pre>
          </div>

          {/* Step 3: Environment Variables */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#00875a] text-white text-xs flex items-center justify-center font-black">3</span>
                Environment Variables (<code className="text-xs text-[#00875a]">.env</code>)
              </h3>
              <button
                onClick={() => handleCopy(sampleEnv, 'env')}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded-lg text-slate-700 transition-all border border-slate-200"
              >
                {copiedSection === 'env' ? <Check className="w-3.5 h-3.5 text-[#00875a]" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSection === 'env' ? 'Copied!' : 'Copy Config'}
              </button>
            </div>
            <pre className="bg-slate-900 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
              {sampleEnv}
            </pre>
          </div>

          {/* Step 4: Server-Side Payment Security Note */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
            <h4 className="font-bold text-emerald-950 flex items-center gap-2 text-xs">
              <Shield className="w-4 h-4 text-[#00875a]" />
              Critical Security Principle: Server-Authoritative Verification
            </h4>
            <p className="text-emerald-900 text-xs leading-relaxed">
              Never trust client-side tokens or status payloads for paid promotions. As implemented in NovaAPK's <code className="text-[#00875a] font-bold">server.ts</code>, orders are generated with server pricing, signed with HMAC-SHA256, and verified strictly on the server before updating permissions or featured slots in Firestore.
            </p>
          </div>

          {/* Step 5: Publishing & Deployment */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#00875a] text-white text-xs flex items-center justify-center font-black">4</span>
              Publishing the Full-Stack Website
            </h3>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <p className="text-slate-600">
                To deploy this full-stack application to production:
              </p>
              <div className="bg-slate-900 p-3 rounded-xl font-mono text-emerald-400 space-y-1">
                <p># 1. Build the production bundle</p>
                <p>npm run build</p>
                <p># 2. Start full-stack server</p>
                <p>npm start</p>
              </div>
              <p className="text-slate-500">
                In Google Cloud / AI Studio, Cloud Run automatically runs <code className="text-slate-700 font-bold">npm start</code> and binds to <code className="text-slate-700 font-bold">process.env.PORT</code>.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#00875a] hover:bg-[#00744e] text-white font-bold text-xs rounded-full shadow-md shadow-[#00875a]/25 transition-all"
          >
            Got it, Back to NovaAPK
          </button>
        </div>
      </div>
    </div>
  );
};
