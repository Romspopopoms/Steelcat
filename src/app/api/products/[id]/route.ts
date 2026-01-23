import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Whitelist des champs modifiables
const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  weight: z.string().optional(),
  status: z.enum(['IN_STOCK', 'PRE_ORDER', 'OUT_OF_STOCK']).optional(),
  stock: z.number().int().min(0).optional(),
  originalPrice: z.number().positive().optional(),
  currentPrice: z.number().positive().optional(),
  hasPromo: z.boolean().optional(),
  promoLimit: z.number().int().positive().nullable().optional(),
  promoSold: z.number().int().min(0).optional(),
  availableDate: z.string().datetime().nullable().optional(),
  preOrderLimit: z.number().int().positive().nullable().optional(),
  preOrderCount: z.number().int().min(0).optional(),
  images: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  popular: z.boolean().optional(),
}).strict();

// GET /api/products/[id] - Récupère un produit spécifique
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du produit' },
      { status: 500 }
    );
  }
}

// PATCH /api/products/[id] - Met à jour un produit (admin only)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérification authentification admin
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Validation Zod du body
    const parseResult = updateProductSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id },
      data: parseResult.data,
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du produit' },
      { status: 500 }
    );
  }
}
