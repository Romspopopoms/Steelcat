import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const createCouponSchema = z.object({
  code: z.string().min(3).max(20).transform(v => v.toUpperCase()),
  type: z.enum(['PERCENTAGE', 'FIXED']),
  value: z.number().positive().max(10000),
  minOrder: z.number().positive().nullable().optional(),
  maxUses: z.number().int().positive().nullable().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  isActive: z.boolean().optional(),
});

// GET /api/admin/coupons - Liste des coupons
export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ coupons });
}

// POST /api/admin/coupons - Créer un coupon
export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = createCouponSchema.parse(body);

    // Vérifier unicité du code
    const existing = await prisma.coupon.findUnique({
      where: { code: data.code },
    });
    if (existing) {
      return NextResponse.json(
        { error: 'Ce code existe déjà' },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: data.code,
        type: data.type,
        value: data.value,
        minOrder: data.minOrder ?? null,
        maxUses: data.maxUses ?? null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        isActive: data.isActive ?? true,
      },
    });

    return NextResponse.json({ coupon }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      );
    }
    console.error('Error creating coupon:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du coupon' },
      { status: 500 }
    );
  }
}

const updateCouponSchema = z.object({
  id: z.string().min(1),
  code: z.string().min(3).max(20).transform(v => v.toUpperCase()).optional(),
  type: z.enum(['PERCENTAGE', 'FIXED']).optional(),
  value: z.number().positive().optional(),
  minOrder: z.number().positive().nullable().optional(),
  maxUses: z.number().int().positive().nullable().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  isActive: z.boolean().optional(),
});

// PATCH /api/admin/coupons - Modifier un coupon
export async function PATCH(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = updateCouponSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      );
    }

    const { id, ...updateData } = parsed.data;

    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        ...updateData,
        expiresAt: updateData.expiresAt !== undefined
          ? (updateData.expiresAt ? new Date(updateData.expiresAt) : null)
          : undefined,
      },
    });

    return NextResponse.json({ coupon });
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du coupon' },
      { status: 500 }
    );
  }
}
