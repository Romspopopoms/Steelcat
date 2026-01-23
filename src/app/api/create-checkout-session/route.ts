import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import Stripe from 'stripe';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { rateLimit, getRateLimitIdentifier } from '@/lib/rate-limit';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const customerInfoSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  phone: z.string().min(1).max(30),
  address: z.string().min(1).max(300),
  city: z.string().min(1).max(100),
  postalCode: z.string().min(1).max(10),
});

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-10-29.clover',
  });
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  try {
    const ip = getRateLimitIdentifier(request);
    const { success } = rateLimit(`checkout:${ip}`, { limit: 10, windowSeconds: 60 });
    if (!success) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Réessayez dans un moment.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { items, couponCode } = body;

    // Validate customerInfo with Zod
    const customerInfoResult = customerInfoSchema.safeParse(body.customerInfo);
    if (!customerInfoResult.success) {
      return NextResponse.json(
        { error: 'Informations client invalides' },
        { status: 400 }
      );
    }
    const customerInfo = customerInfoResult.data;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Panier vide' },
        { status: 400 }
      );
    }

    // Récupérer les produits depuis la DB pour vérification des prix
    const productIds = items.map((item: any) => item.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const dbProductMap = new Map(dbProducts.map(p => [p.id, p]));

    // Vérifier que tous les produits existent et valider les prix
    for (const item of items) {
      const dbProduct = dbProductMap.get(item.id);
      if (!dbProduct) {
        return NextResponse.json(
          { error: `Produit ${item.id} non trouvé` },
          { status: 400 }
        );
      }

      // Vérifier que le prix envoyé correspond au prix en base
      if (Math.abs(item.price - dbProduct.currentPrice) > 0.01) {
        return NextResponse.json(
          { error: `Prix incorrect pour ${dbProduct.name}. Veuillez rafraîchir la page.` },
          { status: 400 }
        );
      }

      // Vérifier le stock
      if (dbProduct.stock < item.quantity && dbProduct.status !== 'PRE_ORDER') {
        return NextResponse.json(
          { error: `Stock insuffisant pour ${dbProduct.name} ${dbProduct.weight}` },
          { status: 400 }
        );
      }

      // Vérifier la limite de précommande
      if (dbProduct.status === 'PRE_ORDER' && dbProduct.preOrderLimit) {
        if (dbProduct.preOrderCount + item.quantity > dbProduct.preOrderLimit) {
          return NextResponse.json(
            { error: `Limite de précommande atteinte pour ${dbProduct.name} ${dbProduct.weight}` },
            { status: 400 }
          );
        }
      }
    }

    // Recalculer les montants côté serveur
    const subtotal = items.reduce((sum: number, item: any) => {
      const dbProduct = dbProductMap.get(item.id)!;
      return sum + dbProduct.currentPrice * item.quantity;
    }, 0);

    const shipping = subtotal >= 50 ? 0 : 5.9;

    // Appliquer le coupon si fourni
    let discount = 0;
    let appliedCoupon: any = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });

      if (coupon && coupon.isActive) {
        const now = new Date();
        const isExpired = coupon.expiresAt && coupon.expiresAt < now;
        const isMaxUsed = coupon.maxUses && coupon.usedCount >= coupon.maxUses;
        const isBelowMinOrder = coupon.minOrder && subtotal < coupon.minOrder;

        if (!isExpired && !isMaxUsed && !isBelowMinOrder) {
          if (coupon.type === 'PERCENTAGE') {
            discount = subtotal * (coupon.value / 100);
          } else {
            discount = Math.min(coupon.value, subtotal);
          }
          appliedCoupon = coupon;
        }
      }
    }

    const total = Math.max(0, subtotal + shipping - discount);

    // Convert cart items to Stripe line items using DB prices
    const lineItems = items.map((item: any) => {
      const dbProduct = dbProductMap.get(item.id)!;
      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${dbProduct.name} - ${dbProduct.weight}`,
            images: dbProduct.images.length > 0
              ? [dbProduct.images[0].startsWith('/') ? `${process.env.NEXT_PUBLIC_BASE_URL}${dbProduct.images[0]}` : dbProduct.images[0]]
              : [],
          },
          unit_amount: Math.round(dbProduct.currentPrice * 100),
        },
        quantity: item.quantity,
      };
    });

    // Add shipping if needed
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Frais de livraison',
            images: [],
          },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    // Add discount as negative line item if applicable
    if (discount > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Réduction${appliedCoupon ? ` (${appliedCoupon.code})` : ''}`,
            images: [],
          },
          unit_amount: -Math.round(discount * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
      customer_email: customerInfo.email,
      shipping_address_collection: {
        allowed_countries: ['FR'],
      },
      metadata: {
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        customerPhone: customerInfo.phone,
      },
    });

    // Annuler les commandes PENDING anciennes pour éviter les doublons
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    await prisma.order.deleteMany({
      where: {
        email: customerInfo.email,
        status: 'PENDING',
        createdAt: { lt: fiveMinutesAgo },
        paidAt: null,
      },
    });

    // Générer un numéro de commande robuste
    const orderNumber = `SC-${randomUUID().slice(0, 8).toUpperCase()}`;

    let isPreOrder = false;
    let estimatedDelivery: Date | null = null;

    // Vérifier si la commande contient des précommandes
    for (const item of items) {
      const dbProduct = dbProductMap.get(item.id)!;
      if (dbProduct.status === 'PRE_ORDER') {
        isPreOrder = true;
        if (dbProduct.availableDate && (!estimatedDelivery || dbProduct.availableDate > estimatedDelivery)) {
          estimatedDelivery = dbProduct.availableDate;
        }
      }
    }

    await prisma.order.create({
      data: {
        orderNumber,
        status: 'PENDING',
        email: customerInfo.email,
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        phone: customerInfo.phone,
        address: customerInfo.address,
        city: customerInfo.city,
        postalCode: customerInfo.postalCode,
        subtotal,
        shipping,
        discount,
        couponCode: appliedCoupon?.code || null,
        total,
        stripeSessionId: session.id,
        isPreOrder,
        estimatedDelivery,
        items: {
          create: items.map((item: any) => {
            const dbProduct = dbProductMap.get(item.id)!;
            return {
              productId: item.id,
              quantity: item.quantity,
              unitPrice: dbProduct.currentPrice,
              totalPrice: dbProduct.currentPrice * item.quantity,
              productName: dbProduct.name,
              productWeight: dbProduct.weight,
              productStatus: dbProduct.status,
            };
          }),
        },
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url, orderNumber });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    );
  }
}
