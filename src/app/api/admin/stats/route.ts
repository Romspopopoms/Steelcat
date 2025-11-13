import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

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

    // Récupérer les statistiques
    const [totalOrders, orders, products] = await Promise.all([
      prisma.order.count(),
      prisma.order.findMany({
        where: {
          status: {
            in: ['PAID', 'PRE_ORDER', 'PROCESSING', 'SHIPPED', 'DELIVERED'],
          },
        },
      }),
      prisma.product.findMany(),
    ]);

    const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.total, 0);
    const preOrders = await prisma.order.count({
      where: { isPreOrder: true, status: 'PRE_ORDER' },
    });
    const lowStockProducts = products.filter(p => p.stock < 20).length;

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
