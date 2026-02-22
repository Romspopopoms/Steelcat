import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { sendAvailabilityNotificationEmail, sendShippingNotificationEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'PRE_ORDER', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  trackingNumber: z.string().max(100).optional(),
});

// Valid status transitions (state machine)
const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['PAID', 'CANCELLED'],
  PAID: ['PROCESSING', 'CANCELLED'],
  PRE_ORDER: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const parsed = updateOrderStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      );
    }
    const { status, trackingNumber } = parsed.data;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    // Validate status transition
    const allowedTransitions = VALID_TRANSITIONS[order.status] || [];
    if (!allowedTransitions.includes(status)) {
      return NextResponse.json(
        { error: `Transition de ${order.status} vers ${status} non autorisée` },
        { status: 400 }
      );
    }

    // Si on passe une précommande en PROCESSING ou SHIPPED, envoyer l'email de disponibilité
    const shouldNotify =
      order.isPreOrder &&
      order.status === 'PRE_ORDER' &&
      (status === 'PROCESSING' || status === 'SHIPPED') &&
      !order.notificationSent;

    // Handle cancellation: restore stock/pre-order counts
    if (status === 'CANCELLED' && (order.status === 'PAID' || order.status === 'PRE_ORDER' || order.status === 'PROCESSING')) {
      await prisma.$transaction(async (tx) => {
        for (const item of order.items) {
          const product = await tx.product.findUnique({ where: { id: item.productId } });
          if (!product) continue;

          if (product.status === 'PRE_ORDER') {
            await tx.product.update({
              where: { id: product.id },
              data: { preOrderCount: { decrement: item.quantity } },
            });
          } else {
            await tx.product.update({
              where: { id: product.id },
              data: { stock: { increment: item.quantity } },
            });
          }
        }
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status,
        notificationSent: shouldNotify ? true : order.notificationSent,
        ...(trackingNumber !== undefined && { trackingNumber }),
        ...(status === 'SHIPPED' && { shippedAt: new Date() }),
        ...(status === 'DELIVERED' && { deliveredAt: new Date() }),
      },
    });

    // Envoyer l'email d'expédition quand le statut passe à SHIPPED
    if (status === 'SHIPPED') {
      try {
        await sendShippingNotificationEmail({
          orderNumber: order.orderNumber,
          customerName: `${order.firstName} ${order.lastName}`,
          email: order.email,
          trackingNumber: trackingNumber || order.trackingNumber,
        });
        console.log(`Shipping notification sent for order ${order.orderNumber}`);
      } catch (emailError) {
        console.error('Error sending shipping notification:', emailError);
      }
    }

    // Envoyer l'email de disponibilité si nécessaire
    if (shouldNotify) {
      try {
        await sendAvailabilityNotificationEmail({
          orderNumber: order.orderNumber,
          customerName: `${order.firstName} ${order.lastName}`,
          email: order.email,
          items: order.items.map((item: any) => ({
            name: item.productName,
            weight: item.productWeight,
          })),
        });
        console.log(`Availability notification sent for order ${order.orderNumber}`);
      } catch (emailError) {
        console.error('Error sending availability notification:', emailError);
      }
    }

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la commande' },
      { status: 500 }
    );
  }
}
