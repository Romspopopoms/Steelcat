import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/products - Liste tous les produits
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: [
        { popular: 'desc' },
        { weight: 'asc' },
      ],
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    );
  }
}
