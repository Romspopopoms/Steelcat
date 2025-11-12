import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  subject: z.string().min(5, 'Le sujet doit contenir au moins 5 caractères'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = contactSchema.parse(body);

    // TODO: In production, you would:
    // 1. Send an email using a service like SendGrid, Resend, or Nodemailer
    // 2. Store the message in a database
    // 3. Send a notification to your team

    // For now, we'll just log it and return success
    console.log('Contact form submission:', {
      ...validatedData,
      timestamp: new Date().toISOString(),
    });

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json(
      {
        success: true,
        message: 'Votre message a été envoyé avec succès',
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Données invalides',
          errors: error.issues,
        },
        { status: 400 }
      );
    }

    console.error('Error processing contact form:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Une erreur est survenue lors de l\'envoi du message',
      },
      { status: 500 }
    );
  }
}
