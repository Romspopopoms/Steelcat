import type { Metadata } from "next";
import "./globals.css";
import Cart from "@/components/Cart";

export const metadata: Metadata = {
  title: "SteelCat - Litière Premium pour Chat",
  description: "Découvrez SteelCat, la litière premium qui allie élégance et performance pour le confort de votre chat.",
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
      </body>
    </html>
  );
}
