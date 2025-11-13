import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/orders - Créer une nouvelle commande
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customerInfo, subtotal, shipping, total, stripeSessionId } = body;

    // Générer un numéro de commande unique
    const orderNumber = `SC${Date.now()}`;

    // Vérifier si la commande contient des précommandes
    let isPreOrder = false;
    let estimatedDelivery: Date | null = null;

    // Créer la commande avec les items
    const order = await prisma.$transaction(async (tx) => {
      // Vérifier et mettre à jour les stocks et promos
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.id },
        });

        if (!product) {
          throw new Error(`Produit ${item.id} non trouvé`);
        }

        // Vérifier le stock disponible
        if (product.stock < item.quantity) {
          throw new Error(`Stock insuffisant pour ${product.name} ${product.weight}`);
        }

        // Vérifier si c'est une précommande
        if (product.status === 'PRE_ORDER') {
          isPreOrder = true;
          if (product.availableDate && (!estimatedDelivery || product.availableDate > estimatedDelivery)) {
            estimatedDelivery = product.availableDate;
          }
        }

        // Mettre à jour le stock
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: { decrement: item.quantity },
          },
        });

        // Mettre à jour le compteur de promo si applicable
        if (product.hasPromo && product.promoLimit) {
          const newPromoSold = product.promoSold + item.quantity;

          await tx.product.update({
            where: { id: item.id },
            data: {
              promoSold: newPromoSold,
              // Désactiver la promo si la limite est atteinte
              hasPromo: newPromoSold < product.promoLimit,
            },
          });
        }

        // Incrémenter le compteur de précommandes si applicable
        if (product.status === 'PRE_ORDER') {
          await tx.product.update({
            where: { id: item.id },
            data: {
              preOrderCount: { increment: item.quantity },
            },
          });
        }
      }

      // Créer la commande
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          status: isPreOrder ? 'PRE_ORDER' : 'PENDING',
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
          stripeSessionId,
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
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      order,
      orderNumber,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création de la commande' },
      { status: 500 }
    );
  }
}

// GET /api/orders?email=xxx - Récupérer les commandes d'un client
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const orderNumber = searchParams.get('orderNumber');

    if (!email && !orderNumber) {
      return NextResponse.json(
        { error: 'Email ou numéro de commande requis' },
        { status: 400 }
      );
    }

    let orders;

    if (orderNumber) {
      const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      return NextResponse.json({ order });
    }

    if (email) {
      orders = await prisma.order.findMany({
        where: { email },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return NextResponse.json({ orders });
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    );
  }
}
