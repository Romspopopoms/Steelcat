import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { rateLimit, getRateLimitIdentifier } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const erasureSchema = z.object({
  email: z.string().email(),
});

// POST /api/gdpr/erasure - Demande de suppression des données personnelles (RGPD Art. 17)
export async function POST(request: NextRequest) {
  try {
    const ip = getRateLimitIdentifier(request);
    const { success } = rateLimit(`gdpr:${ip}`, { limit: 3, windowSeconds: 3600 });
    if (!success) {
      return NextResponse.json(
        { error: 'Trop de demandes. Réessayez plus tard.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = erasureSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    // Anonymiser les commandes associées à cet email
    // Note: On ne supprime pas les commandes pour des raisons légales/comptables,
    // mais on anonymise les données personnelles
    // Réponse identique dans tous les cas pour éviter l'énumération d'emails
    await prisma.order.updateMany({
      where: { email },
      data: {
        email: 'anonymized@deleted.local',
        firstName: 'SUPPRIMÉ',
        lastName: 'SUPPRIMÉ',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        stripeSessionId: null,
        stripePaymentIntent: null,
      },
    });

    return NextResponse.json({
      message: 'Si des données sont associées à cet email, elles ont été anonymisées conformément au RGPD.',
    });
  } catch (error) {
    console.error('Error processing GDPR erasure:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement de la demande' },
      { status: 500 }
    );
  }
}
