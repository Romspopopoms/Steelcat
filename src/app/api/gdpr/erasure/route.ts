import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { rateLimit, getRateLimitIdentifier } from '@/lib/rate-limit';
import { getTransporter } from '@/lib/email';

export const dynamic = 'force-dynamic';

const erasureRequestSchema = z.object({
  email: z.string().email(),
});

const erasureConfirmSchema = z.object({
  email: z.string().email(),
  token: z.string().length(64),
});

// In-memory store for erasure tokens (valid 1 hour)
const erasureTokens = new Map<string, { email: string; expires: number }>();

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

    // Step 2: Confirm erasure with token
    const confirmParsed = erasureConfirmSchema.safeParse(body);
    if (confirmParsed.success) {
      const { email, token } = confirmParsed.data;

      const stored = erasureTokens.get(token);
      if (!stored || stored.email !== email || stored.expires < Date.now()) {
        return NextResponse.json(
          { error: 'Token invalide ou expiré. Veuillez refaire une demande.' },
          { status: 400 }
        );
      }

      // Token valid - proceed with anonymization
      erasureTokens.delete(token);

      // Use unique anonymous ID per batch to prevent cross-order correlation
      const anonId = crypto.randomBytes(8).toString('hex');

      await prisma.order.updateMany({
        where: { email },
        data: {
          email: `anon-${anonId}@erased.invalid`,
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
        message: 'Vos données personnelles ont été anonymisées conformément au RGPD.',
        confirmed: true,
      });
    }

    // Step 1: Request erasure - send verification email
    const requestParsed = erasureRequestSchema.safeParse(body);
    if (!requestParsed.success) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }

    const { email } = requestParsed.data;

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex');
    erasureTokens.set(token, { email, expires: Date.now() + 3600000 }); // 1h validity

    // Clean up expired tokens
    for (const [key, val] of erasureTokens) {
      if (val.expires < Date.now()) erasureTokens.delete(key);
    }

    // Send verification email (always send, even if no orders exist, to prevent enumeration)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://steel-cat.com';
      const transporter = getTransporter();
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Confirmation de suppression de données - SteelCat',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Demande de suppression de données</h2>
            <p>Vous avez demandé la suppression de vos données personnelles chez SteelCat.</p>
            <p>Pour confirmer cette action irréversible, cliquez sur le lien ci-dessous :</p>
            <p style="margin: 24px 0;">
              <a href="${baseUrl}/gdpr/confirm?token=${token}&email=${encodeURIComponent(email)}"
                 style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Confirmer la suppression
              </a>
            </p>
            <p style="color: #666; font-size: 14px;">Ce lien expire dans 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Error sending GDPR verification email:', emailError);
    }

    // Réponse identique dans tous les cas pour éviter l'énumération d'emails
    return NextResponse.json({
      message: 'Si des données sont associées à cet email, un lien de confirmation vous a été envoyé.',
      confirmed: false,
    });
  } catch (error) {
    console.error('Error processing GDPR erasure:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement de la demande' },
      { status: 500 }
    );
  }
}
