"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { useCartStore } from "@/store/cartStore";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { getTotalItems, toggleCart } = useCartStore();
  const itemCount = getTotalItems();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 border-b border-gray-200 bg-white z-30">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo />
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden md:flex md:items-center md:gap-8">
            <Link href="/" className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
              Accueil
            </Link>
            <Link href="/produit" className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
              Produit
            </Link>
            <Link href="/contact" className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
              Contact
            </Link>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-900 hover:text-gray-600 transition-colors"
              aria-label="Panier"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            <Link href="/produit" className="bg-black text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
              Commander
            </Link>
          </div>

          {/* Mobile: Cart + Menu */}
          <div className="md:hidden flex items-center gap-4">
            {/* Cart Button Mobile */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-900 hover:text-gray-600 transition-colors"
              aria-label="Panier"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-900 hover:text-gray-600"
              aria-label="Menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-gray-200 mt-2">
            <Link href="/" className="block text-sm font-medium text-gray-900 hover:text-gray-600">
              Accueil
            </Link>
            <Link href="/produit" className="block text-sm font-medium text-gray-900 hover:text-gray-600">
              Produit
            </Link>
            <Link href="/contact" className="block text-sm font-medium text-gray-900 hover:text-gray-600">
              Contact
            </Link>
            <Link href="/produit" className="block w-full bg-black text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-800 text-center">
              Commander
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
