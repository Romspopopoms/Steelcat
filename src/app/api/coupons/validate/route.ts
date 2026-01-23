import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Code promo requis' },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json(
        { error: 'Code promo invalide' },
        { status: 404 }
      );
    }

    if (!coupon.isActive) {
      return NextResponse.json(
        { error: 'Ce code promo n\'est plus actif' },
        { status: 400 }
      );
    }

    const now = new Date();
    if (coupon.expiresAt && coupon.expiresAt < now) {
      return NextResponse.json(
        { error: 'Ce code promo a expiré' },
        { status: 400 }
      );
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json(
        { error: 'Ce code promo a atteint sa limite d\'utilisation' },
        { status: 400 }
      );
    }

    if (coupon.minOrder && subtotal < coupon.minOrder) {
      return NextResponse.json(
        { error: `Montant minimum de commande : ${coupon.minOrder.toFixed(2)} €` },
        { status: 400 }
      );
    }

    // Calculer la réduction
    let discount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discount = (subtotal || 0) * (coupon.value / 100);
    } else {
      discount = Math.min(coupon.value, subtotal || 0);
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount: Math.round(discount * 100) / 100,
      },
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la validation du code promo' },
      { status: 500 }
    );
  }
}
