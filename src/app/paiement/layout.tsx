import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Paiement sécurisé - SteelCat',
  description: 'Paiement sécurisé via Stripe',
  robots: { index: false, follow: false },
};

export default function PaiementLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
