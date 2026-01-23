import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { rateLimit, getRateLimitIdentifier } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// GET /api/orders/by-session?sessionId=xxx - Récupérer une commande par session Stripe
export async function GET(request: NextRequest) {
  try {
    const ip = getRateLimitIdentifier(request);
    const { success } = rateLimit(`orders-session:${ip}`, { limit: 10, windowSeconds: 60 });
    if (!success) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Réessayez dans un moment.' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    // Stripe session IDs start with cs_ and are 60+ chars
    if (!sessionId || sessionId.length < 30 || !sessionId.startsWith('cs_')) {
      return NextResponse.json(
        { error: 'sessionId invalide' },
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
