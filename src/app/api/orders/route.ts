import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { rateLimit, getRateLimitIdentifier } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// GET /api/orders?email=xxx&orderNumber=yyy - Récupérer une commande
// Exige email ET orderNumber ensemble pour empêcher l'énumération
export async function GET(request: NextRequest) {
  try {
    const ip = getRateLimitIdentifier(request);
    const { success } = rateLimit(`orders:${ip}`, { limit: 10, windowSeconds: 60 });
    if (!success) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Réessayez dans un moment.' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const orderNumber = searchParams.get('orderNumber');

    // Exiger les deux paramètres
    if (!email || !orderNumber) {
      return NextResponse.json(
        { error: 'Email et numéro de commande requis' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        email,
        orderNumber,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la commande' },
      { status: 500 }
    );
  }
}
