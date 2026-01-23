import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout - SteelCat',
  description: 'Finalisez votre commande SteelCat',
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
