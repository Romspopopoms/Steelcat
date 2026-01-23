import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
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
