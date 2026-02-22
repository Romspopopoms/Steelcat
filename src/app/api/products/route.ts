import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { rateLimit, getRateLimitIdentifier } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// GET /api/products - Liste tous les produits
export async function GET(request: NextRequest) {
  try {
    const ip = getRateLimitIdentifier(request);
    const { success } = rateLimit(`products:${ip}`, { limit: 30, windowSeconds: 60 });
    if (!success) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Réessayez dans un moment.' },
        { status: 429 }
      );
    }

    const products = await prisma.product.findMany({
      orderBy: [
        { popular: 'desc' },
        { weight: 'asc' },
      ],
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Error fetching products:', error?.message);
    return NextResponse.json(
      {
        error: 'Erreur lors de la récupération des produits',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}
