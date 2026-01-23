import type { Metadata } from "next";
import "./globals.css";
import Cart from "@/components/Cart";
import CookieConsent from "@/components/CookieConsent";

export const metadata: Metadata = {
  title: "SteelCat - Litière Premium pour Chat",
  description: "Découvrez SteelCat, la litière premium qui allie élégance et performance pour le confort de votre chat.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://steel-cat.com"),
  openGraph: {
    title: "SteelCat - Litière Premium pour Chat",
    description: "Découvrez SteelCat, la litière premium qui allie élégance et performance pour le confort de votre chat.",
    type: "website",
    locale: "fr_FR",
    siteName: "SteelCat",
  },
  twitter: {
    card: "summary_large_image",
    title: "SteelCat - Litière Premium pour Chat",
    description: "Découvrez SteelCat, la litière premium qui allie élégance et performance pour le confort de votre chat.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
        <Cart />
        <CookieConsent />
      </body>
    </html>
  );
}
