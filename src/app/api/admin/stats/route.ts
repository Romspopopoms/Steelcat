import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { rateLimit, getRateLimitIdentifier } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const ip = getRateLimitIdentifier(request);
    const { success } = rateLimit(`admin-stats:${ip}`, { limit: 60, windowSeconds: 60 });
    if (!success) {
      return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 });
    }

    // Vérifier l'authentification
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer les statistiques avec des requêtes agrégées (plus efficace)
    const [totalOrders, revenueResult, preOrders, lowStockProducts] = await Promise.all([
      prisma.order.count({
        where: {
          status: {
            in: ['PAID', 'PRE_ORDER', 'PROCESSING', 'SHIPPED', 'DELIVERED'],
          },
        },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          status: {
            in: ['PAID', 'PRE_ORDER', 'PROCESSING', 'SHIPPED', 'DELIVERED'],
          },
        },
      }),
      prisma.order.count({
        where: { isPreOrder: true, status: 'PRE_ORDER' },
      }),
      prisma.product.count({
        where: { stock: { lt: 20 } },
      }),
    ]);

    const totalRevenue = revenueResult._sum.total || 0;

    return NextResponse.json({
      totalOrders,
      totalRevenue,
      preOrders,
      lowStockProducts,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}
