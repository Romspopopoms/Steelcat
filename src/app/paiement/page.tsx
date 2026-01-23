'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function PaiementPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initiatePayment = async () => {
      // Get checkout data from localStorage with safe parsing
      const raw = sessionStorage.getItem('checkoutData');

      if (!raw) {
        router.push('/checkout');
        return;
      }

      let data: any;
      try {
        data = JSON.parse(raw);
      } catch {
        sessionStorage.removeItem('checkoutData');
        router.push('/checkout');
        return;
      }

      if (!data || !data.items || !data.customerInfo) {
        sessionStorage.removeItem('checkoutData');
        router.push('/checkout');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Create Stripe Checkout Session
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const { sessionId, url, error: apiError } = await response.json();

        if (apiError) {
          throw new Error(apiError);
        }

        // Redirect to Stripe Checkout
        if (url) {
          window.location.href = url;
        }
      } catch (err: any) {
        console.error('Payment error:', err);
        setError(err.message || 'Une erreur est survenue lors du paiement');
        setIsLoading(false);
      }
    };

    initiatePayment();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          {isLoading && (
            <>
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-black mb-6"></div>
              <h1 className="text-2xl font-bold text-black mb-4">
                Redirection vers le paiement sécurisé...
              </h1>
              <p className="text-gray-600">
                Vous allez être redirigé vers notre plateforme de paiement
                sécurisée Stripe.
              </p>
            </>
          )}

          {error && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-black mb-4">
                Erreur de paiement
              </h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => router.push('/checkout')}
                className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Retour au checkout
              </button>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
