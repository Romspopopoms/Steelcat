import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

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
    const body = await request.json();
    const { items, customerInfo, subtotal, shipping, total } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Panier vide' },
        { status: 400 }
      );
    }

    // Convert cart items to Stripe line items
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: `${item.name} - ${item.weight}`,
          images: [item.image.startsWith('/') ? `${process.env.NEXT_PUBLIC_BASE_URL}${item.image}` : item.image],
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects amount in cents
      },
      quantity: item.quantity,
    }));

    // Add shipping if needed
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    if (subtotal < 50) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Frais de livraison',
          },
          unit_amount: 590, // 5.90€
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

    // Créer la commande en PENDING dans la base de données
    const orderNumber = `SC${Date.now()}`;
    let isPreOrder = false;
    let estimatedDelivery: Date | null = null;

    // Vérifier si la commande contient des précommandes
    for (const item of items) {
      if (item.status === 'PRE_ORDER') {
        isPreOrder = true;
        if (item.availableDate && (!estimatedDelivery || new Date(item.availableDate) > estimatedDelivery)) {
          estimatedDelivery = new Date(item.availableDate);
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
        total,
        stripeSessionId: session.id,
        isPreOrder,
        estimatedDelivery,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
            productName: item.name,
            productWeight: item.weight,
            productStatus: item.status || 'IN_STOCK',
          })),
        },
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url, orderNumber });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    );
  }
}
