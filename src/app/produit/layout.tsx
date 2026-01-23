import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SteelCat Premium - Litière en acier inoxydable pour chat',
  description: 'Découvrez la litière SteelCat Premium en acier inoxydable. Ultra-absorbante, sans odeur, durable 3 à 6 mois. Disponible en 5kg, 10kg et 15kg.',
  openGraph: {
    title: 'SteelCat Premium - Litière innovante pour chat',
    description: 'Litière en acier inoxydable premium. Ultra-absorbante, sans odeur, écologique. Livraison offerte dès 50€.',
    type: 'website',
  },
};

export default function ProduitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
