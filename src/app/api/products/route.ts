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
  } catch (error: any) {
    console.error('Error fetching products:', error);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    return NextResponse.json(
      {
        error: 'Erreur lors de la récupération des produits',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}
