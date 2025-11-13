import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { sendAvailabilityNotificationEmail } from '@/lib/email';

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
    const { status } = body;

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

    // Si on passe une précommande en PROCESSING ou SHIPPED, envoyer l'email de disponibilité
    const shouldNotify =
      order.isPreOrder &&
      order.status === 'PRE_ORDER' &&
      (status === 'PROCESSING' || status === 'SHIPPED') &&
      !order.notificationSent;

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status,
        notificationSent: shouldNotify ? true : order.notificationSent,
        ...(status === 'SHIPPED' && { shippedAt: new Date() }),
        ...(status === 'DELIVERED' && { deliveredAt: new Date() }),
      },
    });

    // Envoyer l'email de disponibilité si nécessaire
    if (shouldNotify) {
      try {
        await sendAvailabilityNotificationEmail({
          orderNumber: order.orderNumber,
          customerName: `${order.firstName} ${order.lastName}`,
          email: order.email,
          items: order.items.map(item => ({
            name: item.productName,
            weight: item.productWeight,
          })),
        });
        console.log(`📧 Availability notification sent to ${order.email}`);
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
