'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setVisible(true);
    } else {
      try {
        setPreferences(JSON.parse(consent));
      } catch {}
    }
  }, []);

  const reopenBanner = () => {
    const saved = localStorage.getItem('cookie-consent');
    if (saved) {
      try { setPreferences(JSON.parse(saved)); } catch {}
    }
    setShowDetails(true);
    setVisible(true);
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    setVisible(false);
  };

  const refuseAll = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(DEFAULT_PREFERENCES));
    setVisible(false);
  };

  const savePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    setVisible(false);
  };

  if (!visible) {
    const hasConsent = typeof window !== 'undefined' && localStorage.getItem('cookie-consent');
    if (!hasConsent) return null;
    return (
      <button
        onClick={reopenBanner}
        className="fixed bottom-4 left-4 z-50 bg-white border border-gray-300 rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
        aria-label="Gérer les cookies"
        title="Gérer les cookies"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="8" cy="9" r="1.5" fill="currentColor"/>
          <circle cx="15" cy="7" r="1" fill="currentColor"/>
          <circle cx="10" cy="14" r="1.5" fill="currentColor"/>
          <circle cx="16" cy="13" r="1" fill="currentColor"/>
          <circle cx="13" cy="17" r="1" fill="currentColor"/>
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {!showDetails ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                Nous utilisons des cookies pour améliorer votre expérience sur notre site.
                En continuant, vous acceptez notre{' '}
                <Link href="/cookies" className="underline font-medium text-black">
                  politique de cookies
                </Link>.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowDetails(true)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-black"
              >
                Personnaliser
              </button>
              <button
                onClick={refuseAll}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-black"
              >
                Refuser
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Accepter tout
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-bold text-black mb-4">Paramètres des cookies</h3>
            <div className="space-y-3 mb-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="h-4 w-4 rounded border-gray-300"
                />
                <div>
                  <span className="text-sm font-medium text-black">Cookies nécessaires</span>
                  <p className="text-xs text-gray-500">Indispensables au fonctionnement du site (panier, session).</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <div>
                  <span className="text-sm font-medium text-black">Cookies analytiques</span>
                  <p className="text-xs text-gray-500">Nous aident à comprendre comment vous utilisez le site.</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <div>
                  <span className="text-sm font-medium text-black">Cookies marketing</span>
                  <p className="text-xs text-gray-500">Permettent de vous proposer des contenus personnalisés.</p>
                </div>
              </label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-black"
              >
                Retour
              </button>
              <button
                onClick={savePreferences}
                className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Enregistrer mes choix
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
