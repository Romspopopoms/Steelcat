import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { rateLimit, getRateLimitIdentifier } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const ip = getRateLimitIdentifier(request);
    const { success } = rateLimit(`admin-preorders:${ip}`, { limit: 60, windowSeconds: 60 });
    if (!success) {
      return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 });
    }

    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const preOrders = await prisma.order.findMany({
      where: {
        isPreOrder: true,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 500,
    });

    return NextResponse.json({ preOrders });
  } catch (error) {
    console.error('Error fetching pre-orders:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des précommandes' },
      { status: 500 }
    );
  }
}
