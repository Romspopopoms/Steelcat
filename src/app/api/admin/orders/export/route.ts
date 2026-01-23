import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const validStatuses = ['PENDING', 'PAID', 'PRE_ORDER', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const;

const exportFilterSchema = z.object({
  status: z.enum(validStatuses).nullable(),
  from: z.string().datetime().nullable(),
  to: z.string().datetime().nullable(),
});

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const rawStatus = searchParams.get('status');
  const rawFrom = searchParams.get('from');
  const rawTo = searchParams.get('to');

  const filterResult = exportFilterSchema.safeParse({
    status: rawStatus || null,
    from: rawFrom || null,
    to: rawTo || null,
  });

  if (!filterResult.success) {
    return NextResponse.json(
      { error: 'Paramètres de filtre invalides' },
      { status: 400 }
    );
  }

  const { status, from, to } = filterResult.data;

  const where: Record<string, any> = {};

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
    take: 10000,
  });

  // Sanitize and quote CSV values to prevent formula injection
  function csvField(value: string): string {
    // Strip formula-triggering characters
    let safe = value;
    if (/^[=+\-@\t\r]/.test(safe)) {
      safe = `'${safe}`;
    }
    // Always double-quote, escaping internal quotes
    return `"${safe.replace(/"/g, '""')}"`;
  }

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
    csvField(order.orderNumber),
    csvField(new Date(order.createdAt).toISOString()),
    csvField(order.status),
    csvField(order.email),
    csvField(order.firstName),
    csvField(order.lastName),
    csvField(order.phone),
    csvField(order.address),
    csvField(order.city),
    csvField(order.postalCode),
    order.subtotal.toFixed(2),
    order.shipping.toFixed(2),
    order.discount.toFixed(2),
    order.couponCode ? csvField(order.couponCode) : '""',
    order.total.toFixed(2),
    csvField(order.items.map(i => `${i.productName} ${i.productWeight} x${i.quantity}`).join(', ')),
    order.isPreOrder ? '"Oui"' : '"Non"',
    order.paidAt ? csvField(new Date(order.paidAt).toISOString()) : '""',
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
