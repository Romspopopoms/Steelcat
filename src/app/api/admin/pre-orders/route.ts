import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
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
