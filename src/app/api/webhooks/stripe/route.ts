import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { sendOrderConfirmationEmail } from '@/lib/email';

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
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Récupérer la commande via le stripeSessionId
      const order = await prisma.order.findUnique({
        where: { stripeSessionId: session.id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!order) {
        console.error(`Order not found for session ${session.id}`);
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      // Idempotence : vérifier si la commande est déjà payée
      if (order.status === 'PAID' || order.paidAt) {
        console.log(`Order ${order.orderNumber} already processed, skipping (idempotent)`);
        return NextResponse.json({ received: true });
      }

      // Mettre à jour la commande dans une transaction
      await prisma.$transaction(async (tx) => {
        // Mettre à jour la commande en PAID
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: order.isPreOrder ? 'PRE_ORDER' : 'PAID',
            stripePaymentIntent: session.payment_intent as string,
            paidAt: new Date(),
          },
        });

        // Mettre à jour les stocks et compteurs de promo pour chaque produit
        for (const orderItem of order.items) {
          const product = orderItem.product;

          // Décrémenter le stock
          await tx.product.update({
            where: { id: product.id },
            data: {
              stock: { decrement: orderItem.quantity },
            },
          });

          // Mettre à jour le compteur de promo si applicable
          if (product.hasPromo && product.promoLimit) {
            const newPromoSold = product.promoSold + orderItem.quantity;

            await tx.product.update({
              where: { id: product.id },
              data: {
                promoSold: newPromoSold,
                hasPromo: newPromoSold < product.promoLimit,
                currentPrice: newPromoSold >= product.promoLimit ? product.originalPrice : product.currentPrice,
              },
            });
          }

          // Incrémenter le compteur de précommandes si applicable
          if (product.status === 'PRE_ORDER') {
            await tx.product.update({
              where: { id: product.id },
              data: {
                preOrderCount: { increment: orderItem.quantity },
              },
            });
          }
        }
      });

      console.log(`Order ${order.orderNumber} confirmed and paid`);

      // Envoyer l'email de confirmation
      try {
        await sendOrderConfirmationEmail({
          orderNumber: order.orderNumber,
          customerName: `${order.firstName} ${order.lastName}`,
          email: order.email,
          items: order.items.map(item => ({
            name: item.productName,
            weight: item.productWeight,
            quantity: item.quantity,
            price: item.unitPrice,
          })),
          subtotal: order.subtotal,
          shipping: order.shipping,
          total: order.total,
          isPreOrder: order.isPreOrder,
          estimatedDelivery: order.estimatedDelivery,
        });
        console.log(`Confirmation email sent to ${order.email}`);
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
      return NextResponse.json(
        { error: 'Error processing webhook' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
