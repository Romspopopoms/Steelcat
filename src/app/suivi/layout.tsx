import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Suivi de commande - SteelCat',
  description: 'Suivez l\'état de votre commande SteelCat',
};

export default function SuiviLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
