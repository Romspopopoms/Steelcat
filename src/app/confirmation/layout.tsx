import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Confirmation de commande - SteelCat',
  description: 'Votre commande SteelCat a été confirmée',
  robots: { index: false, follow: false },
};

export default function ConfirmationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
