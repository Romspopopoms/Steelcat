import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact - SteelCat',
  description: 'Contactez l\'équipe SteelCat pour toute question',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
