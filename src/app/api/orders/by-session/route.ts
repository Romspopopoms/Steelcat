import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/orders/by-session?sessionId=xxx - Récupérer une commande par session Stripe
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId || sessionId.length < 20) {
      return NextResponse.json(
        { error: 'sessionId requis' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { stripeSessionId: sessionId },
      select: {
        orderNumber: true,
        status: true,
        firstName: true,
        subtotal: true,
        shipping: true,
        discount: true,
        total: true,
        isPreOrder: true,
        estimatedDelivery: true,
        createdAt: true,
        items: {
          select: {
            productName: true,
            productWeight: true,
            quantity: true,
            unitPrice: true,
            totalPrice: true,
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
    console.error('Error fetching order by session:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la commande' },
      { status: 500 }
    );
  }
}
