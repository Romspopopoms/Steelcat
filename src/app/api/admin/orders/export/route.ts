import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const where: any = {};

  if (status) {
    where.status = status;
  }

  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // Générer le CSV
  const headers = [
    'Numéro',
    'Date',
    'Statut',
    'Email',
    'Prénom',
    'Nom',
    'Téléphone',
    'Adresse',
    'Ville',
    'Code Postal',
    'Sous-total',
    'Livraison',
    'Réduction',
    'Code Promo',
    'Total',
    'Articles',
    'Précommande',
    'Payée le',
  ];

  const rows = orders.map(order => [
    order.orderNumber,
    new Date(order.createdAt).toISOString(),
    order.status,
    order.email,
    order.firstName,
    order.lastName,
    order.phone,
    `"${order.address.replace(/"/g, '""')}"`,
    order.city,
    order.postalCode,
    order.subtotal.toFixed(2),
    order.shipping.toFixed(2),
    order.discount.toFixed(2),
    order.couponCode || '',
    order.total.toFixed(2),
    `"${order.items.map(i => `${i.productName} ${i.productWeight} x${i.quantity}`).join(', ')}"`,
    order.isPreOrder ? 'Oui' : 'Non',
    order.paidAt ? new Date(order.paidAt).toISOString() : '',
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="commandes-steelcat-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}
