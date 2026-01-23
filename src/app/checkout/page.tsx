'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCartStore } from '@/store/cartStore';

const checkoutSchema = z.object({
  email: z.string().email('Email invalide'),
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  city: z.string().min(2, 'La ville doit contenir au moins 2 caractères'),
  postalCode: z.string().regex(/^\d{5}$/, 'Code postal invalide (5 chiffres)'),
  phone: z.string().regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, 'Numéro de téléphone invalide'),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Vous devez accepter les conditions',
  }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponValid, setCouponValid] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const subtotal = getTotalPrice();
  const shipping = subtotal >= 50 ? 0 : 5.9;
  const total = Math.max(0, subtotal + shipping - couponDiscount);

  const validateCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError(null);
    setCouponValid(null);
    setCouponDiscount(0);

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), subtotal }),
      });

      const data = await response.json();

      if (!response.ok) {
        setCouponError(data.error);
      } else {
        setCouponValid(data.coupon.code);
        setCouponDiscount(data.coupon.discount);
      }
    } catch {
      setCouponError('Erreur de validation');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
    setCouponValid(null);
    setCouponError(null);
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);

    try {
      // Store checkout data for Stripe payment page
      sessionStorage.setItem(
        'checkoutData',
        JSON.stringify({
          items,
          customerInfo: data,
          subtotal,
          shipping,
          total,
          couponCode: couponValid || undefined,
        })
      );

      // Redirect to Stripe payment page
      router.push('/paiement');
    } catch (error) {
      console.error('Error during checkout:', error);
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="text-center p-8">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 mb-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h1 className="text-3xl font-bold text-black mb-4">
              Votre panier est vide
            </h1>
            <p className="text-gray-600 mb-8">
              Ajoutez des produits à votre panier pour passer une commande
            </p>
            <button
              onClick={() => router.push('/produit')}
              className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Découvrir nos produits
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-black mb-12">
            Finaliser votre commande
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Formulaire de commande */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Informations de contact */}
                <div className="bg-white p-8 rounded-2xl shadow-sm">
                  <h2 className="text-2xl font-bold text-black mb-6">
                    Informations de contact
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email
                      </label>
                      <input
                        {...register('email')}
                        type="email"
                        id="email"
                        autoComplete="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-black"
                        placeholder="votre@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Adresse de livraison */}
                <div className="bg-white p-8 rounded-2xl shadow-sm">
                  <h2 className="text-2xl font-bold text-black mb-6">
                    Adresse de livraison
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Prénom
                      </label>
                      <input
                        {...register('firstName')}
                        type="text"
                        id="firstName"
                        autoComplete="given-name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-black"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Nom
                      </label>
                      <input
                        {...register('lastName')}
                        type="text"
                        id="lastName"
                        autoComplete="family-name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-black"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Adresse
                      </label>
                      <input
                        {...register('address')}
                        type="text"
                        id="address"
                        autoComplete="street-address"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-black"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.address.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Ville
                      </label>
                      <input
                        {...register('city')}
                        type="text"
                        id="city"
                        autoComplete="address-level2"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-black"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.city.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="postalCode"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Code postal
                      </label>
                      <input
                        {...register('postalCode')}
                        type="text"
                        id="postalCode"
                        autoComplete="postal-code"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-black"
                        maxLength={5}
                      />
                      {errors.postalCode && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.postalCode.message}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Téléphone
                      </label>
                      <input
                        {...register('phone')}
                        type="tel"
                        id="phone"
                        autoComplete="tel"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-black"
                        placeholder="06 12 34 56 78"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Code promo */}
                <div className="bg-white p-8 rounded-2xl shadow-sm">
                  <h2 className="text-2xl font-bold text-black mb-6">
                    Code promo
                  </h2>
                  {couponValid ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div>
                        <span className="text-green-800 font-semibold">{couponValid}</span>
                        <span className="text-green-600 text-sm ml-2">
                          (-{couponDiscount.toFixed(2)} €)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Supprimer
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Entrez votre code"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-black"
                      />
                      <button
                        type="button"
                        onClick={validateCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                      >
                        {couponLoading ? '...' : 'Appliquer'}
                      </button>
                    </div>
                  )}
                  {couponError && (
                    <p className="text-red-500 text-sm mt-2">{couponError}</p>
                  )}
                </div>

                {/* Conditions générales */}
                <div className="bg-white p-8 rounded-2xl shadow-sm">
                  <div className="flex items-start gap-3">
                    <input
                      {...register('acceptTerms')}
                      type="checkbox"
                      id="acceptTerms"
                      className="mt-1 h-5 w-5 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <label
                      htmlFor="acceptTerms"
                      className="text-sm text-black"
                    >
                      J&apos;accepte les{' '}
                      <a href="/cgv" target="_blank" className="underline font-medium">
                        conditions générales de vente
                      </a>{' '}
                      et la{' '}
                      <a href="/confidentialite" target="_blank" className="underline font-medium">
                        politique de confidentialité
                      </a>
                    </label>
                  </div>
                  {errors.acceptTerms && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.acceptTerms.message}
                    </p>
                  )}
                </div>

                {/* Bouton de validation */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-4 px-8 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Redirection vers le paiement...' : 'Procéder au paiement sécurisé'}
                </button>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Paiement sécurisé par Stripe</span>
                </div>
              </form>
            </div>

            {/* Récapitulatif de commande */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-2xl shadow-sm sticky top-8">
                <h2 className="text-2xl font-bold text-black mb-6">
                  Récapitulatif
                </h2>

                {/* Articles */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate text-black">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-500">{item.weight}</p>
                        <p className="text-sm text-black">Quantité: {item.quantity}</p>
                        <p className="text-sm font-bold text-black">
                          {(item.price * item.quantity).toFixed(2)} €
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totaux */}
                <div className="border-t border-gray-200 pt-6 space-y-3">
                  <div className="flex justify-between text-black">
                    <span>Sous-total</span>
                    <span>{subtotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-black">
                    <span>Livraison</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600 font-semibold">
                          Gratuite
                        </span>
                      ) : (
                        `${shipping.toFixed(2)} €`
                      )}
                    </span>
                  </div>
                  {subtotal < 50 && (
                    <p className="text-xs text-gray-500">
                      Livraison gratuite dès 50€ d&apos;achat
                    </p>
                  )}
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Réduction ({couponValid})</span>
                      <span>-{couponDiscount.toFixed(2)} €</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold text-black pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span>{total.toFixed(2)} €</span>
                  </div>
                </div>

                {/* Paiement sécurisé */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-black">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Paiement 100% sécurisé
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
