import { NextResponse } from 'next/server';
import { verifyAdminCredentials, setAdminSession } from '@/lib/auth';
import { rateLimit, getRateLimitIdentifier } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const ip = getRateLimitIdentifier(request);
    const { success } = rateLimit(`login:${ip}`, { limit: 5, windowSeconds: 300 });
    if (!success) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Réessayez dans quelques minutes.' },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    const admin = await verifyAdminCredentials(email, password);

    if (!admin) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    await setAdminSession(admin);

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
}
